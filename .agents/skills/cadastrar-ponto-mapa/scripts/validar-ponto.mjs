#!/usr/bin/env node
/**
 * Confere um ponto de `src/data/mapa-turistico.json` contra tudo o que dá para
 * checar por máquina: campos obrigatórios, categoria, zona, cerca da região,
 * `acesso`, arquivos de foto, alt, limite de foto do plano e presença nas rotas.
 *
 * Uso:
 *   node .agents/skills/cadastrar-ponto-mapa/scripts/validar-ponto.mjs <id> [--plano mapa|destaque|vitrine | --publico]
 *   node .agents/skills/cadastrar-ponto-mapa/scripts/validar-ponto.mjs --todos
 *
 * Por que um script e não olhar no olho: são nove checagens por ponto, e as que
 * mais quebram — foto que o cadastro lista mas não existe no disco, alt que
 * ninguém escreveu, `npm run rotas` que ninguém rodou — são invisíveis na
 * leitura do JSON e só aparecem na tela do hóspede.
 *
 * Sai com código 1 se houver erro. Aviso não derruba a saída.
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DADOS = join(RAIZ, 'src', 'data');
const ASSETS = join(RAIZ, 'public', 'assets');

const CATEGORIAS = [
  'turismo',
  'cultura',
  'restaurantes',
  'cafes',
  'hospedagem',
  'compras',
  'aventura',
  'experiencias',
  'servicos',
];
const ZONAS = ['bau', 'centro', 'vale'];
const LADO_MAXIMO = 1620;
const PESO_DE_AVISO = 800 * 1024;

const erros = [];
const avisos = [];
const erro = (id, msg) => erros.push(`${id}: ${msg}`);
const aviso = (id, msg) => avisos.push(`${id}: ${msg}`);

/** Largura e altura de um .webp, lidas do cabeçalho RIFF. */
function dimensoesWebp(buf) {
  if (buf.length < 30) return null;
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') {
    return null;
  }

  const formato = buf.toString('ascii', 12, 16);

  if (formato === 'VP8X') {
    return {
      largura: buf.readUIntLE(24, 3) + 1,
      altura: buf.readUIntLE(27, 3) + 1,
    };
  }

  if (formato === 'VP8 ') {
    return {
      largura: buf.readUInt16LE(26) & 0x3fff,
      altura: buf.readUInt16LE(28) & 0x3fff,
    };
  }

  if (formato === 'VP8L') {
    const bits = buf.readUInt32LE(21);
    return {
      largura: (bits & 0x3fff) + 1,
      altura: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  return null;
}

/**
 * Quantas fotos aquele pino pode ter.
 *
 * Atrativo público não tem teto: a Capelinhas de Mosaico tem 13 e está certo.
 * Comércio segue a assinatura, e o pino com selo de Destaque é o único que
 * dobra para 6.
 */
function limiteDeFotos(plano, temDestaque) {
  if (plano === 'publico') return Infinity;
  if (plano === 'mapa') return 3;
  if (plano === 'destaque' || plano === 'vitrine') return temDestaque ? 6 : 3;
  return null;
}

function conferirCampos(local) {
  const { id } = local;

  for (const campo of ['nome', 'cat', 'zona', 'resumo', 'endereco']) {
    if (!local[campo]) erro(id, `falta \`${campo}\``);
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
    erro(id, 'o `id` não é kebab-case sem acento');
  }

  if (local.cat && !CATEGORIAS.includes(local.cat)) {
    erro(id, `categoria \`${local.cat}\` não existe — use uma de: ${CATEGORIAS.join(', ')}`);
  }

  if (local.zona && !ZONAS.includes(local.zona)) {
    erro(id, `zona \`${local.zona}\` não existe — use uma de: ${ZONAS.join(', ')}`);
  }

  if (typeof local.lat !== 'number' || typeof local.lng !== 'number') {
    erro(id, 'falta coordenada numérica em `lat`/`lng`');
  }

  if (local.refugio && id !== 'refugio') {
    erro(id, '`refugio` é só da pousada — o que marca parceiro pago é `destaque`');
  }

  if (local.nota && typeof local.nota !== 'string') {
    erro(id, '`nota` é string no cadastro (ex.: "4,7")');
  }

  if (local.site && !local.site.startsWith('https://')) {
    aviso(id, '`site` sem `https://`');
  }
}

function conferirCerca(local, limites) {
  const [[oeste, sul], [leste, norte]] = limites;
  const { lat, lng, id } = local;
  if (typeof lat !== 'number' || typeof lng !== 'number') return;

  if (lng < oeste || lng > leste || lat < sul || lat > norte) {
    erro(
      id,
      `o pino cai fora da cerca de regiao.json (${oeste}..${leste} / ${sul}..${norte}) — o mapa não deixa arrastar até lá`,
    );
  }
}

function conferirAcesso(local, porId) {
  const { acesso, id } = local;
  if (!acesso) return;

  if (!acesso.aPe) erro(id, '`acesso` sem `aPe`, que é o único campo obrigatório dele');

  const temPonto = Boolean(acesso.ponto);
  const temCoordenada = acesso.lat !== undefined || acesso.lng !== undefined;

  if (temPonto && temCoordenada) {
    erro(id, '`acesso` tem `ponto` e `lat`/`lng` ao mesmo tempo — é um ou outro');
  }

  if (temPonto && !porId.has(acesso.ponto)) {
    erro(id, `\`acesso.ponto\` aponta para \`${acesso.ponto}\`, que não está no cadastro`);
  }

  if (temCoordenada && (typeof acesso.lat !== 'number' || typeof acesso.lng !== 'number')) {
    erro(id, '`acesso` com coordenada incompleta — precisa de `lat` e `lng`');
  }

  if (acesso.nome && /^[A-ZÀ-Ý]/.test(acesso.nome)) {
    aviso(id, `\`acesso.nome\` entra na frase "O carro vai até ___" — escreva em minúscula e com artigo, não "${acesso.nome}"`);
  }
}

async function conferirFotos(local, alt, plano) {
  const { id, fotos } = local;
  const limite = limiteDeFotos(plano, Boolean(local.destaque));

  if (!fotos) {
    if (existsSync(join(ASSETS, 'mapa', id))) {
      aviso(id, `há pasta em public/assets/mapa/${id}/ mas o cadastro não lista foto nenhuma`);
    }
    return;
  }

  // Pasta fora da convenção é aviso, e não erro, porque há exceção legítima: o
  // Refúgio e o Sabor com Arte compartilham a pasta com a seção de parceiros da
  // pousada, que é anterior ao mapa. Ponto novo não tem por que herdar isso.
  const naConvencao = fotos.pasta === `mapa/${id}`;
  if (!naConvencao) {
    aviso(id, `\`fotos.pasta\` é "${fotos.pasta}" — a convenção do mapa é "mapa/${id}"`);
  }

  if (limite !== null && fotos.arquivos.length > limite) {
    erro(
      id,
      `${fotos.arquivos.length} fotos, e o limite deste pino é ${limite} — corte, ou confirme que o cliente pagou o pin com Destaque`,
    );
  }

  const pasta = join(ASSETS, ...fotos.pasta.split('/'));

  for (const [i, arquivo] of fotos.arquivos.entries()) {
    const esperado = `${id}-${i + 1}.webp`;
    if (naConvencao && arquivo !== esperado) {
      aviso(id, `a foto ${i + 1} se chama "${arquivo}" — a convenção é "${esperado}"`);
    }

    const caminho = join(pasta, arquivo);
    if (!existsSync(caminho)) {
      erro(id, `o cadastro lista "${arquivo}", que não existe em public/assets/${fotos.pasta}/`);
      continue;
    }

    const buf = await readFile(caminho);
    const dim = dimensoesWebp(buf);

    if (!dim) {
      erro(id, `"${arquivo}" não é um .webp legível`);
    } else if (Math.max(dim.largura, dim.altura) > LADO_MAXIMO) {
      erro(
        id,
        `"${arquivo}" tem ${dim.largura}x${dim.altura} — o maior lado do acervo é ${LADO_MAXIMO} px`,
      );
    }

    if (buf.length > PESO_DE_AVISO) {
      aviso(id, `"${arquivo}" tem ${Math.round(buf.length / 1024)} KB — recomprima com -quality 75`);
    }

    const publico = `/assets/${fotos.pasta}/${arquivo}`;
    if (!alt[publico]) {
      erro(id, `falta o alt de "${arquivo}" em src/data/image-alt.json (chave "${publico}")`);
    }
  }

  // Só nas pastas do mapa: as compartilhadas com a pousada têm dezenas de fotos
  // que outras páginas usam, e apontá-las aqui seria ruído garantido.
  if (naConvencao && existsSync(pasta)) {
    const noDisco = (await readdir(pasta)).filter((f) => f.endsWith('.webp'));
    const sobrando = noDisco.filter((f) => !fotos.arquivos.includes(f));
    if (sobrando.length) {
      aviso(id, `no disco e fora do cadastro: ${sobrando.join(', ')}`);
    }
  }
}

/** Metros entre dois pares [lng, lat]. */
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

function conferirRotas(local, rotas) {
  for (const [origem, dados] of Object.entries(rotas.origens)) {
    if (dados.rotas[local.id]) continue;

    // O lugar que está em cima da origem não é destino dela, e o gerador o
    // omite de propósito: a Igreja Matriz é a coordenada do Centro, e o Refúgio
    // é a origem `refugio`. Só falta rota mesmo quando o ponto fica longe.
    if (haversine([local.lng, local.lat], dados.origem) < 150) continue;

    erro(local.id, `sem rota a partir de \`${origem}\` — rode \`npm run rotas\``);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const todos = args.includes('--todos');
  const publico = args.includes('--publico');
  const iPlano = args.indexOf('--plano');
  const plano = publico ? 'publico' : iPlano >= 0 ? args[iPlano + 1] : null;
  const ids = args.filter((a) => !a.startsWith('--') && a !== plano);

  if (!todos && ids.length === 0) {
    console.error('Uso: validar-ponto.mjs <id> [--plano mapa|destaque|vitrine | --publico] | --todos');
    process.exit(2);
  }

  if (plano && !['mapa', 'destaque', 'vitrine', 'publico'].includes(plano)) {
    console.error(`Plano \`${plano}\` não existe. Use mapa, destaque, vitrine ou --publico.`);
    process.exit(2);
  }

  const ler = async (arquivo) => JSON.parse(await readFile(join(DADOS, arquivo), 'utf8'));
  const [locais, alt, regiao, rotas] = await Promise.all([
    ler('mapa-turistico.json'),
    ler('image-alt.json'),
    ler('regiao.json'),
    ler('rotas.json'),
  ]);

  const porId = new Map(locais.map((l) => [l.id, l]));
  if (porId.size !== locais.length) {
    erro('cadastro', 'há `id` repetido em mapa-turistico.json');
  }

  const alvos = todos ? locais : ids.map((id) => porId.get(id));

  for (const [i, local] of alvos.entries()) {
    if (!local) {
      erro(ids[i], 'não está em mapa-turistico.json');
      continue;
    }

    conferirCampos(local);
    conferirCerca(local, regiao.limites);
    conferirAcesso(local, porId);
    conferirRotas(local, rotas);
    await conferirFotos(local, alt, todos ? null : plano);
  }

  if (!todos && !plano) {
    console.log('Sem --plano nem --publico: o limite de fotos não foi conferido.\n');
  }

  for (const a of avisos) console.log(`aviso  ${a}`);
  for (const e of erros) console.log(`ERRO   ${e}`);

  const quantos = alvos.filter(Boolean).length;
  console.log(
    `\n${quantos} ponto(s) conferido(s) — ${erros.length} erro(s), ${avisos.length} aviso(s).`,
  );

  process.exit(erros.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
