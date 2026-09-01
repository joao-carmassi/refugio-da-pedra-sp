#!/usr/bin/env node
/**
 * Precomputes the driving route from each origin to every place in the tourist
 * map and writes them to `src/data/rotas.json`.
 *
 * Usage:
 *   node scripts/gerar-rotas.mjs
 *   npm run rotas
 *
 * Why at build time instead of fetching from the browser: the origins are
 * fixed and the destinations are a hand-curated list, so the answer never
 * changes between visitors. Precomputing means the route panel opens with no
 * spinner, keeps working when the routing service is down, and — most
 * importantly — keeps every visitor of a live hotel site off the public OSRM
 * demo server, which is meant for development, not production traffic.
 *
 * São duas origens, e não uma. O mapa passou a ter dois usos: sem parâmetro
 * nenhum ele é o mapa da cidade, e mede tudo a partir do Centro de São Bento
 * (`src/data/centro.json`); com `?refugio=1` ele é o mapa do hóspede, e mede a
 * partir da pousada. Uma origem em tempo de execução não resolveria isso — o
 * ponto inteiro deste arquivo é que linha reta mente aqui: a portaria do
 * Monumento Natural fica a 1,3 km da varanda em linha reta e a 17,3 km de
 * estrada, porque a estrada contorna o maciço. Cada origem precisa, então, do
 * seu próprio conjunto de rotas gravado, e os dois saem da mesma rodada para
 * nunca envelhecerem em ritmos diferentes.
 *
 * Re-run this whenever a coordinate changes in `mapa-turistico.json` or in
 * `centro.json`. The script refuses to write a partial file: either every
 * place gets a route from every origin or nothing is written, so a network
 * hiccup can never silently shorten the data.
 *
 * The destination is not always the place. Cume, laje e setor de escalada não
 * têm estrada até a porta, e o `acesso` do cadastro declara onde o carro para
 * — é para lá que a rota é medida, porque "19,0 km de carro" até um cume que
 * se alcança a pé manda o hóspede procurar um estacionamento que não existe.
 * O cadastro de `acesso` é validado antes da primeira requisição: uma
 * referência quebrada gravaria o número velho em silêncio, e este script
 * existe justamente para que isso não aconteça.
 *
 * The geometry is `overview=simplified` and coordinates are rounded to five
 * decimals (~1 m), which is far more precision than a line drawn on a zoomed
 * out map can show — full precision would triple the file for nothing.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const entrada = join(root, 'src', 'data', 'mapa-turistico.json');
// A coordenada do centro mora num arquivo só, lido aqui e importado pelo
// `mapa-turistico.ts`: repetida nos dois lados, ela envelheceria de um lado só
// e as distâncias gravadas passariam a sair de um lugar diferente do que a
// ficha diz na tela.
const centroJson = join(root, 'src', 'data', 'centro.json');
const saida = join(root, 'src', 'data', 'rotas.json');

const SERVIDOR = 'https://router.project-osrm.org/route/v1/driving';
/** The demo server asks for light use; one request per second is the ceiling. */
const INTERVALO = 1200;
const TENTATIVAS = 3;

const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const arredonda = (n) => Math.round(n * 1e5) / 1e5;

/** Straight-line metres, used only to report how far a point sits from a road. */
function haversine([lngA, latA], [lngB, latB]) {
  const R = 6371000;
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(latB - latA);
  const dLng = rad(lngB - lngA);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(latA)) * Math.cos(rad(latB)) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

async function buscar(origem, destino) {
  const url =
    `${SERVIDOR}/${origem.lng},${origem.lat};${destino.lng},${destino.lat}` +
    '?overview=simplified&geometries=geojson';

  for (let tentativa = 1; tentativa <= TENTATIVAS; tentativa += 1) {
    try {
      const resposta = await fetch(url, { signal: AbortSignal.timeout(30000) });
      const dados = await resposta.json();

      if (dados.code !== 'Ok' || !dados.routes?.length) {
        throw new Error(`OSRM respondeu ${dados.code ?? resposta.status}`);
      }

      const rota = dados.routes[0];
      const [origemSnap, destinoSnap] = dados.waypoints;

      return {
        metros: Math.round(rota.distance),
        segundos: Math.round(rota.duration),
        // Quanto a estrada mais próxima ficou do ponto para onde a rota foi
        // pedida — que é a parada de carro, e não necessariamente o pino.
        // Depois que os cumes ganharam `acesso`, este número tem de ser
        // pequeno em todo lugar: quando cresce, é cheiro de cadastro, não
        // dica de trilha. Quem diz o que falta a pé é `Acesso.aPe`.
        desvio: Math.round(haversine([destino.lng, destino.lat], destinoSnap.location)),
        _origemDesvio: Math.round(
          haversine([origem.lng, origem.lat], origemSnap.location),
        ),
        linha: rota.geometry.coordinates.map(([lng, lat]) => [
          arredonda(lng),
          arredonda(lat),
        ]),
      };
    } catch (erro) {
      if (tentativa === TENTATIVAS) throw erro;
      await espera(INTERVALO * tentativa);
    }
  }
}

const locais = JSON.parse(await readFile(entrada, 'utf8'));
const centro = JSON.parse(await readFile(centroJson, 'utf8'));
const refugio = locais.find((local) => local.refugio);

if (!refugio) {
  console.error('rotas: nenhum local marcado como `refugio` em mapa-turistico.json');
  process.exit(1);
}

/**
 * As duas origens, na ordem em que entram no arquivo.
 *
 * `id` é a chave por onde `getRota` acha o conjunto, e é o mesmo `OrigemId` do
 * `mapa-turistico.ts` — mudar um nome aqui sem mudar lá deixa o site pedindo um
 * conjunto que não existe. O `nome` viaja junto por conferência: é ele que a
 * ficha escreve em "A partir do ___", e vê-lo gravado ao lado dos números diz,
 * numa olhada, de onde eles saíram.
 */
const ORIGENS = [
  { id: 'refugio', nome: refugio.nome, lat: refugio.lat, lng: refugio.lng },
  { id: 'centro', nome: centro.nome, lat: centro.lat, lng: centro.lng },
];

const porId = new Map(locais.map((local) => [local.id, local]));

/**
 * O cadastro de `acesso` é conferido inteiro antes da primeira requisição.
 *
 * Um `ponto` que não resolve não quebra nada: `getParada` cai de volta no
 * próprio lugar e o arquivo sai com o número velho, certinho, mentindo. É o
 * modo de falha que este script foi escrito para não ter — daí interromper
 * antes de gravar, como já se faz com a rede.
 */
const erros = [];

for (const local of locais) {
  const acesso = local.acesso;
  if (!acesso) continue;

  if (typeof acesso.aPe !== 'string' || !acesso.aPe.trim()) {
    erros.push(`${local.id}: acesso sem \`aPe\` — é o campo que diz o que sobra a pé`);
  }

  const temCoordenada = acesso.lat !== undefined || acesso.lng !== undefined;

  if (acesso.ponto && temCoordenada) {
    erros.push(`${local.id}: acesso com \`ponto\` e coordenada juntos — escolha um`);
  }

  if (temCoordenada) {
    if (typeof acesso.lat !== 'number' || typeof acesso.lng !== 'number') {
      erros.push(`${local.id}: acesso com coordenada pela metade`);
    }
    if (!acesso.nome) {
      erros.push(
        `${local.id}: acesso por coordenada precisa de \`nome\` — é o que entra em "O carro vai até ___"`,
      );
    }
  }

  if (acesso.ponto) {
    const parada = porId.get(acesso.ponto);

    if (!parada) {
      erros.push(`${local.id}: acesso aponta para "${acesso.ponto}", que não está no cadastro`);
    } else if (parada.id === local.id) {
      erros.push(`${local.id}: acesso aponta para si mesmo`);
    } else if (parada.acesso) {
      erros.push(
        `${local.id}: acesso aponta para "${acesso.ponto}", que também tem acesso — a corrente pararia onde?`,
      );
    }
  }
}

if (erros.length) {
  console.error('rotas: cadastro de `acesso` inválido. Nada foi gravado:');
  for (const erro of erros) console.error(`  · ${erro}`);
  process.exit(1);
}

/** Where the car actually stops. Without a declared stop, it is the place itself. */
function paradaDe(local) {
  const acesso = local.acesso;
  if (!acesso) return local;

  if (acesso.ponto) return porId.get(acesso.ponto);
  if (acesso.lat !== undefined) return { lat: acesso.lat, lng: acesso.lng };

  return local;
}

/**
 * O lugar que está exatamente sobre a origem não é destino dela: é o próprio
 * ponto de partida.
 *
 * Vale para as duas origens, e é por isso que a regra é a coordenada e não
 * `local.refugio`: com o Refúgio na origem quem sai da lista é a pousada; com o
 * Centro na origem quem sai é a Praça Monsenhor Pedro do Vale Monteiro, que
 * ocupa a mesma coordenada. Pedir essa rota devolveria 0 m, e "0 m · 0 min de
 * carro" é
 * pior do que a frase que a ficha põe no lugar — a mesma regra roda no
 * `mapa-turistico.ts`, onde ela vira "Ponto de partida".
 *
 * Note que a pousada é destino comum quando a origem é o Centro: no mapa da
 * cidade ela é um lugar como os outros, e precisa da distância que os outros
 * têm.
 */
const naOrigem = (local, origem) =>
  local.lat === origem.lat && local.lng === origem.lng;

/**
 * O intervalo é do servidor, não de cada origem.
 *
 * Contar a pausa por origem faria a primeira rota do Centro sair colada na
 * última do Refúgio — o dobro do ritmo combinado, justamente na virada. Uma
 * marca só, para a rodada inteira, é o que mantém a promessa de uma requisição
 * a cada 1,2 s de ponta a ponta.
 */
let jaPediu = false;

async function rotasDe(origem) {
  const destinos = locais.filter((local) => !naOrigem(local, origem));
  const rotas = {};

  /**
   * Cinco lugares do Complexo do Baú param na mesma portaria, e sem cache
   * seriam cinco perguntas idênticas ao servidor de demonstração do OSRM. Com
   * ele, os que dividem a parada dividem os números exatos — que é justamente
   * a verdade a ser contada: de carro, chega-se ao mesmo lugar.
   *
   * O cache é de cada origem: a mesma parada vista de dois pontos de partida
   * são duas estradas diferentes, e reaproveitar entre origens gravaria a
   * quilometragem do Refúgio dentro do conjunto do Centro.
   */
  const cache = new Map();

  for (const destino of destinos) {
    const parada = paradaDe(destino);
    const chave = `${arredonda(parada.lng)},${arredonda(parada.lat)}`;
    let rota = cache.get(chave);

    if (!rota) {
      // A pausa fica antes da chamada de rede, e não entre destinos: acerto de
      // cache não pede intervalo nenhum ao servidor.
      if (jaPediu) await espera(INTERVALO);
      rota = await buscar(origem, parada);
      jaPediu = true;
      cache.set(chave, rota);
    }

    rotas[destino.id] = rota;

    console.log(
      `rotas: ${origem.id}/${destino.id} — ${(rota.metros / 1000).toFixed(1)} km, ` +
        `${Math.round(rota.segundos / 60)} min` +
        (destino.acesso?.ponto || destino.acesso?.lat !== undefined
          ? ' (até a parada declarada; o resto é a pé)'
          : '') +
        (rota.desvio > 250 ? ` — atenção: estrada a ${rota.desvio} m do ponto pedido` : ''),
    );
  }

  return { destinos, rotas, origemDesvio: rotas[destinos[0].id]._origemDesvio };
}

/**
 * As duas rodadas inteiras antes de gravar qualquer coisa.
 *
 * É a mesma promessa de sempre — ou tudo, ou nada —, agora com um motivo a
 * mais: um arquivo com o conjunto do Refúgio novo e o do Centro velho é pior
 * do que um arquivo velho inteiro, porque a incoerência entre os dois não
 * aparece em lugar nenhum da tela.
 */
const gerado = [];

for (const origem of ORIGENS) gerado.push([origem, await rotasDe(origem)]);

/**
 * Hand-rolled so each route stays on a handful of lines, geometry included.
 * `JSON.stringify(…, 2)` puts every coordinate of every route on its own line:
 * the same data becomes a 99 KB file that no diff can be read through.
 */
const corpo = gerado
  .map(([origem, { rotas, origemDesvio }]) => {
    const linhas = Object.entries(rotas)
      .map(
        ([id, rota]) =>
          `        ${JSON.stringify(id)}: {\n` +
          `          "metros": ${rota.metros},\n` +
          `          "segundos": ${rota.segundos},\n` +
          `          "desvio": ${rota.desvio},\n` +
          `          "linha": ${JSON.stringify(rota.linha)}\n` +
          '        }',
      )
      .join(',\n');

    return (
      `    ${JSON.stringify(origem.id)}: {\n` +
      `      "nome": ${JSON.stringify(origem.nome)},\n` +
      // Guardados para conferência: se uma coordenada de origem mudar e ninguém
      // rodar o script, é por aqui que se descobre que os números envelheceram.
      `      "origem": ${JSON.stringify([arredonda(origem.lng), arredonda(origem.lat)])},\n` +
      `      "origemDesvio": ${origemDesvio},\n` +
      '      "rotas": {\n' +
      `${linhas}\n` +
      '      }\n' +
      '    }'
    );
  })
  .join(',\n');

const arquivo =
  '{\n' +
  `  "_comentario": ${JSON.stringify(
    'Gerado por scripts/gerar-rotas.mjs (npm run rotas). Não editar à mão: ' +
      'rode o script de novo depois de mexer numa coordenada de ' +
      'mapa-turistico.json ou de centro.json.',
  )},\n` +
  '  "fonte": "OSRM · OpenStreetMap",\n' +
  '  "origens": {\n' +
  `${corpo}\n` +
  '  }\n' +
  '}\n';

await writeFile(saida, arquivo, 'utf8');

for (const [origem, { destinos, rotas, origemDesvio }] of gerado) {
  const longe = Object.entries(rotas).filter(([, r]) => r.desvio > 250);

  console.log(
    `rotas: ${origem.id} — ${destinos.length} rotas gravadas, ` +
      `origem encaixou a ${origemDesvio} m da estrada`,
  );

  if (longe.length) {
    console.log(
      `rotas: ${origem.id} — ${longe.length} ponto(s) sem estrada até a coordenada pedida: ` +
        longe.map(([id, r]) => `${id} (${r.desvio} m)`).join(', ') +
        '. Ou falta `acesso` no cadastro, ou ele aponta para onde não passa carro.',
    );
  }
}

console.log('rotas: src/data/rotas.json gravado');
