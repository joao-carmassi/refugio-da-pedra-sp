#!/usr/bin/env node
/**
 * Baixa a base cartográfica inteira da região e a congela em
 * `public/mapa-base/<snapshot>/`, para o mapa desenhar sem depender de rede.
 *
 * Usage:
 *   node scripts/gerar-base-offline.mjs
 *   npm run base
 *
 * Por que cabe. O mapa não é do mundo, é de São Bento do Sapucaí: a cerca de
 * `regiao.json` impede o hóspede de arrastar para fora, e o zoom vai de 10,5 a
 * 17. A fonte vetorial do OpenFreeMap termina no zoom 14, então tudo acima
 * disso é o próprio MapLibre esticando o último tile, sem requisição nova. A
 * conta fecha em ~700 tiles e ~4,6 MB — o mapa inteiro que existe, e não uma
 * amostra dele.
 *
 * Por que na build e não no navegador, como em `gerar-rotas.mjs`: a resposta é a
 * mesma para todo visitante e não muda entre um deploy e outro. Congelada aqui,
 * ela abre sem espera, sobrevive ao OpenFreeMap sair do ar e — o ponto deste
 * arquivo — pode ser guardada num cache para funcionar sem sinal nenhum.
 *
 * E há um motivo que só aparece depois: se o mapa continuasse buscando tiles no
 * OpenFreeMap, o caminho deles carregaria o snapshot *deles*. No dia em que o
 * projeto girasse a leva de dados, o pacote que cada hóspede baixou viraria
 * inalcançável de uma vez, sem aviso para ele nem para nós. Servindo daqui, a
 * troca de snapshot passa a ser um `npm run base` deliberado.
 *
 * Ou tudo é gravado, ou nada. Um pacote pela metade é um mapa com buraco, e
 * buraco em mapa offline não se distingue de "aqui não tem nada" — o hóspede
 * concluiria que não há estrada onde só faltou um arquivo. Por isso o script
 * junta tudo em memória (são poucos megabytes) e só toca no disco no fim.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const REGIAO = join(root, 'src', 'data', 'regiao.json');
const INDICE = join(root, 'src', 'data', 'base-offline.json');
const ESTILO = join(root, 'src', 'data', 'base-estilo.json');
const DESTINO = join(root, 'public', 'mapa-base');

const ESTILO_REMOTO = 'https://tiles.openfreemap.org/styles/liberty';

/**
 * Faixas de glifo baixadas por fontstack.
 *
 * `0-255` é ASCII mais Latin-1 Supplement, onde mora todo o português acentuado
 * — é ela que desenha "São Bento" e "Sapucaí". A `256-511` (Latin Extended-A)
 * entra por seguro: custa uns 300 KB no pacote inteiro e evita que um nome do
 * OpenStreetMap com caractere fora do comum apareça picotado num mapa que, por
 * definição, não tem como buscar o que falta.
 */
const FAIXAS_GLIFO = ['0-255', '256-511'];

/** Requisições em voo. O OpenFreeMap não impõe limite; a boa educação, sim. */
const SIMULTANEAS = 6;
const TENTATIVAS = 3;

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function baixar(url, comoTexto = false) {
  for (let tentativa = 1; ; tentativa++) {
    try {
      const resposta = await fetch(url);

      // 404 e 204 não são falha de rede: são buraco no planeta do OpenFreeMap,
      // tile de área sem nada mapeado. Quem chama decide o que fazer.
      if (resposta.status === 404 || resposta.status === 204) return null;
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

      return comoTexto
        ? await resposta.text()
        : Buffer.from(await resposta.arrayBuffer());
    } catch (erro) {
      if (tentativa === TENTATIVAS) {
        throw new Error(`Falhou em ${url}: ${erro.message}`);
      }

      await espera(500 * tentativa);
    }
  }
}

/** Roda `tarefa` sobre cada item, com no máximo `SIMULTANEAS` em voo. */
async function emLote(itens, tarefa, aoAndar) {
  const fila = [...itens];
  let feitos = 0;

  async function operario() {
    for (let item = fila.shift(); item; item = fila.shift()) {
      await tarefa(item);
      aoAndar?.(++feitos, itens.length);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(SIMULTANEAS, itens.length) }, operario),
  );
}

const paraX = (lng, z) => Math.floor(((lng + 180) / 360) * 2 ** z);

const paraY = (lat, z) => {
  const rad = (lat * Math.PI) / 180;

  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z,
  );
};

/**
 * As faixas de tile por zoom, com a folga da região aplicada.
 *
 * A folga não é margem de segurança vaga: no zoom mínimo a viewport de um
 * desktop largo cobre mais graus do que a cerca inteira tem, e o MapLibre
 * então encosta o enquadramento no limite e desenha uma faixa de fora dela. Sem
 * a folga, essa faixa fica cinza na abertura — justamente no primeiro quadro
 * que o hóspede vê.
 */
function faixasDeTile(regiao, maxzoom) {
  const [[oeste, sul], [leste, norte]] = regiao.limites;
  const folga = regiao.folgaTiles;
  const faixas = {};

  for (let z = Math.floor(regiao.zoomMinimo); z <= maxzoom; z++) {
    const teto = 2 ** z - 1;
    const prende = (n) => Math.min(Math.max(n, 0), teto);

    faixas[z] = {
      x0: prende(paraX(oeste, z) - folga),
      x1: prende(paraX(leste, z) + folga),
      y0: prende(paraY(norte, z) - folga),
      y1: prende(paraY(sul, z) + folga),
    };
  }

  return faixas;
}

function listarTiles(faixas) {
  const tiles = [];

  for (const [z, { x0, x1, y0, y1 }] of Object.entries(faixas)) {
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) tiles.push({ z: Number(z), x, y });
    }
  }

  return tiles;
}

/**
 * Confere que o estilo do OpenFreeMap ainda é o que este script sabe traduzir.
 *
 * Vale o mesmo que a validação de `acesso` em `gerar-rotas.mjs`: uma mudança
 * silenciosa lá fora gravaria aqui um pacote meio certo, e meio certo num mapa
 * offline é pior que quebrado — ninguém vai conferir 700 tiles à mão. Se o
 * OpenFreeMap reestruturar o `liberty`, este script tem de parar e dizer o quê.
 */
function conferirEstilo(estilo, tilejson) {
  const reclama = (o_que) => {
    throw new Error(
      `O estilo do OpenFreeMap mudou: ${o_que}. Confira o liberty e ajuste este script antes de gerar o pacote.`,
    );
  };

  if (tilejson.maxzoom !== 14) reclama(`a fonte agora vai até z${tilejson.maxzoom}`);
  if (!tilejson.attribution) reclama('o TileJSON não traz mais atribuição');

  const emNe2 = estilo.layers.filter((c) => c.source === 'ne2_shaded');

  if (emNe2.length !== 1 || emNe2[0].id !== 'natural_earth') {
    reclama(
      `esperava uma camada só em ne2_shaded (natural_earth), achei ${emNe2.length}`,
    );
  }

  const orfas = estilo.layers.filter(
    (c) => c.source && c.source !== 'openmaptiles' && c.source !== 'ne2_shaded',
  );

  if (orfas.length) reclama(`camadas em fonte desconhecida: ${orfas.map((c) => c.id).join(', ')}`);
}

/**
 * Reescreve o estilo para apontar para dentro de casa.
 *
 * Cópia fiel de propósito: `paleta-cartografica.ts` repinta a base percorrendo
 * as camadas por id, então renomear, reordenar ou enxugar camada quebraria a
 * paleta em silêncio — o mapa continuaria desenhando, na cor errada. O que muda
 * aqui são as URLs, e só.
 *
 * Duas exceções, ambas justificadas:
 *
 *   1. `attribution` passa a vir escrito na fonte. Hoje ele chega junto com o
 *      TileJSON remoto, que deixa de ser buscado — e sem ele o crédito ao
 *      OpenStreetMap sumiria da tela, o que o ODbL não permite.
 *   2. `ne2_shaded` sai, e com ela a única camada que a usa. É um raster de
 *      maxzoom 6 num mapa que começa no zoom 10,5: nunca foi requisitado uma vez
 *      sequer. Mantê-lo deixaria no estilo local uma URL externa dormente,
 *      esperando um zoom que a cerca não deixa acontecer — e uma fonte declarada
 *      sem camada, ou uma camada sem fonte, faz o MapLibre recusar o estilo
 *      inteiro. Os dois saem juntos ou nenhum sai.
 *
 * Os caminhos são absolutos de raiz para não dependerem de onde o estilo mora:
 * relativos, eles se resolveriam contra a URL do próprio arquivo, e o dia em que
 * a pasta mudasse de nível levaria os tiles junto.
 *
 * O `sprite` sai daqui torto e é endireitado no cliente. O MapLibre resolve
 * `tiles` e `glyphs` a partir da raiz sem reclamar, mas para o sprite ele faz um
 * `new URL(valor)` sem base — que só aceita URL com esquema e host, coisa que
 * não existe em tempo de build, quando o mesmo arquivo vai servir localhost e o
 * domínio de produção. Quem completa é `getEstiloBase()`, em
 * `base-cartografica.ts`.
 */
function reescreverEstilo(estilo, base, tilejson, regiao) {
  const { vector_layers, ...vetorial } = estilo.sources.openmaptiles;

  void vector_layers; // 19 KB de metadado que o MapLibre não lê.

  return {
    ...estilo,
    sources: {
      openmaptiles: {
        ...vetorial,
        url: undefined,
        type: 'vector',
        tiles: [`${base}/tiles/{z}/{x}/{y}.pbf`],
        minzoom: tilejson.minzoom ?? 0,
        maxzoom: tilejson.maxzoom,
        bounds: regiao.limites.flat(),
        attribution: tilejson.attribution,
      },
    },
    sprite: `${base}/sprite/ofm`,
    glyphs: `${base}/glifos/{fontstack}/{range}.pbf`,
    layers: estilo.layers.filter((camada) => camada.source !== 'ne2_shaded'),
  };
}

async function main() {
  const regiao = JSON.parse(await readFile(REGIAO, 'utf8'));
  const [[oeste, sul], [leste, norte]] = regiao.limites;

  console.log(
    `Cerca ${oeste},${sul} a ${leste},${norte} — zoom ${regiao.zoomMinimo} a ${regiao.zoomMaximo}, folga de ${regiao.folgaTiles} tile`,
  );

  const estilo = JSON.parse(await baixar(ESTILO_REMOTO, true));
  const tilejson = JSON.parse(
    await baixar(estilo.sources.openmaptiles.url, true),
  );

  conferirEstilo(estilo, tilejson);

  const modelo = tilejson.tiles[0];
  const snapshot = modelo.match(/\/planet\/([^/]+)\//)?.[1];

  if (!snapshot) throw new Error(`Não achei o snapshot em ${modelo}`);

  const base = `/mapa-base/${snapshot}`;

  console.log(`Snapshot ${snapshot} — fonte vetorial até z${tilejson.maxzoom}`);

  // O teto é o da fonte, não o da tela: acima do maxzoom o MapLibre estica o
  // último tile em vez de pedir outro, então baixar z15+ traria arquivo que
  // ninguém requisita.
  const faixas = faixasDeTile(regiao, tilejson.maxzoom);
  const tiles = listarTiles(faixas);

  console.log(
    `${tiles.length} tiles: ${Object.entries(faixas)
      .map(([z, f]) => `z${z} ${(f.x1 - f.x0 + 1) * (f.y1 - f.y0 + 1)}`)
      .join(', ')}`,
  );

  /** Caminho relativo à pasta do pacote -> conteúdo. Nada vai ao disco antes do fim. */
  const arquivos = new Map();
  /** Tiles que o próprio OpenFreeMap não tem. Vazio de dados, não erro. */
  const ausentes = [];

  await emLote(
    tiles,
    async ({ z, x, y }) => {
      const conteudo = await baixar(
        modelo.replace('{z}', z).replace('{x}', x).replace('{y}', y),
      );

      if (conteudo) arquivos.set(`tiles/${z}/${x}/${y}.pbf`, conteudo);
      else ausentes.push(`${z}/${x}/${y}`);
    },
    (feitos, total) => {
      if (feitos % 100 === 0 || feitos === total) {
        console.log(`  tiles ${feitos}/${total}`);
      }
    },
  );

  // Os fontstacks vêm do próprio estilo, e juntados por vírgula como o MapLibre
  // os pede: um `text-font` com mais de uma fonte vira uma requisição só, com as
  // duas escritas no nome.
  const fontstacks = new Set();
  for (const camada of estilo.layers) {
    const fontes = camada.layout?.['text-font'];
    if (fontes) fontstacks.add(fontes.join(','));
  }

  console.log(`${fontstacks.size} fontstacks × ${FAIXAS_GLIFO.length} faixas`);

  for (const stack of fontstacks) {
    for (const faixa of FAIXAS_GLIFO) {
      const conteudo = await baixar(
        estilo.glyphs
          .replace('{fontstack}', encodeURIComponent(stack))
          .replace('{range}', faixa),
      );

      if (conteudo) arquivos.set(`glifos/${stack}/${faixa}.pbf`, conteudo);
    }
  }

  // Os quatro: o MapLibre escolhe entre 1x e 2x pelo `devicePixelRatio`, e um
  // hóspede em tela comum não pode cair na rede porque só o @2x foi guardado.
  for (const nome of ['ofm.json', 'ofm.png', 'ofm@2x.json', 'ofm@2x.png']) {
    arquivos.set(
      `sprite/${nome}`,
      await baixar(`${estilo.sprite}${nome.slice('ofm'.length)}`),
    );
  }

  const local = reescreverEstilo(estilo, base, tilejson, regiao);
  const bytes = [...arquivos.values()].reduce((soma, b) => soma + b.length, 0);
  const pasta = join(DESTINO, snapshot);

  /*
   * O índice do pacote, do lado do código e não dentro de `public/`.
   *
   * É daqui que o botão de baixar tira a lista de URLs, e daqui que
   * `base-cartografica.ts` tira o snapshot para montar o caminho do estilo. As
   * faixas vão como faixas, e não como 700 caminhos escritos: o bundle carrega
   * duzentos bytes em vez de quinze mil, e a geometria fica legível para quem
   * abrir o arquivo — que é o que um caminho literal repetido 700 vezes não é.
   */
  const indice = {
    _comentario:
      'Gerado por scripts/gerar-base-offline.mjs (`npm run base`). Não editar à mão: os números descrevem os arquivos que estão em public/mapa-base/, e um índice que não bate com a pasta é um download que promete o que não existe.',
    snapshot,
    gerado: new Date().toISOString().slice(0, 10),
    tiles: tiles.length - ausentes.length,
    bytes,
    faixas,
    ausentes,
    glifos: [...fontstacks],
    faixasGlifo: FAIXAS_GLIFO,
  };

  // Só agora o disco é tocado, e a pasta antiga só cai depois de o pacote novo
  // estar inteiro em memória.
  await rm(DESTINO, { recursive: true, force: true });

  for (const [caminho, conteudo] of arquivos) {
    const alvo = join(pasta, caminho);

    await mkdir(dirname(alvo), { recursive: true });
    await writeFile(alvo, conteudo);
  }

  await writeFile(INDICE, `${JSON.stringify(indice, null, 2)}\n`);

  /*
   * O estilo vai para `src/data/`, e não para dentro do pacote em `public/`.
   *
   * Importado, ele chega junto com o bundle — que o service worker guarda
   * inteiro na primeira visita — em vez de ser mais uma requisição que o mapa
   * precisa esperar antes de desenhar o primeiro traço. E o caminho fica
   * estável: dentro do pacote ele mudaria de endereço a cada snapshot, e nenhum
   * `import` sobrevive a isso.
   */
  await writeFile(ESTILO, `${JSON.stringify(local, null, 1)}\n`);

  console.log(
    `\n${arquivos.size} arquivos, ${(bytes / 1048576).toFixed(2)} MB em public/mapa-base/${snapshot}/`,
  );
  if (ausentes.length) console.log(`${ausentes.length} tiles vazios no planeta`);
  console.log('Índice e estilo em src/data/');
}

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});
