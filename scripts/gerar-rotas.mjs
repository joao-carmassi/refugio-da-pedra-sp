#!/usr/bin/env node
/**
 * Precomputes the driving route from the Refúgio to every place in the tourist
 * map and writes them to `src/data/rotas.json`.
 *
 * Usage:
 *   node scripts/gerar-rotas.mjs
 *   npm run rotas
 *
 * Why at build time instead of fetching from the browser: the origin is fixed
 * and the destinations are a hand-curated list, so the answer never changes
 * between visitors. Precomputing means the route panel opens with no spinner,
 * keeps working when the routing service is down, and — most importantly —
 * keeps every visitor of a live hotel site off the public OSRM demo server,
 * which is meant for development, not production traffic.
 *
 * Re-run this whenever a coordinate changes in `mapa-turistico.json`. The
 * script refuses to write a partial file: either every place gets a route or
 * nothing is written, so a network hiccup can never silently shorten the data.
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
        // Quanto a estrada mais próxima ficou do ponto cadastrado. Cume e
        // cachoeira não têm estrada até a porta: o número é o que sobra de
        // caminhada, e a interface avisa quando é grande.
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
const refugio = locais.find((local) => local.refugio);

if (!refugio) {
  console.error('rotas: nenhum local marcado como `refugio` em mapa-turistico.json');
  process.exit(1);
}

const destinos = locais.filter((local) => !local.refugio);
const rotas = {};

for (const [indice, destino] of destinos.entries()) {
  const rota = await buscar(refugio, destino);
  rotas[destino.id] = rota;

  console.log(
    `rotas: ${destino.id} — ${(rota.metros / 1000).toFixed(1)} km, ` +
      `${Math.round(rota.segundos / 60)} min` +
      (rota.desvio > 250 ? ` (estrada a ${rota.desvio} m do ponto)` : ''),
  );

  if (indice < destinos.length - 1) await espera(INTERVALO);
}

const origemDesvio = rotas[destinos[0].id]._origemDesvio;

/**
 * Hand-rolled so each route stays on a handful of lines, geometry included.
 * `JSON.stringify(…, 2)` puts every coordinate of every route on its own line:
 * the same data becomes a 99 KB file that no diff can be read through.
 */
const corpo = Object.entries(rotas)
  .map(
    ([id, rota]) =>
      `    ${JSON.stringify(id)}: {\n` +
      `      "metros": ${rota.metros},\n` +
      `      "segundos": ${rota.segundos},\n` +
      `      "desvio": ${rota.desvio},\n` +
      `      "linha": ${JSON.stringify(rota.linha)}\n` +
      '    }',
  )
  .join(',\n');

const arquivo =
  '{\n' +
  `  "_comentario": ${JSON.stringify(
    'Gerado por scripts/gerar-rotas.mjs (npm run rotas). Não editar à mão: ' +
      'rode o script de novo depois de mexer numa coordenada de mapa-turistico.json.',
  )},\n` +
  '  "fonte": "OSRM · OpenStreetMap",\n' +
  // Guardados para conferência: se a coordenada do Refúgio mudar e ninguém
  // rodar o script, é por aqui que se descobre que os números envelheceram.
  `  "origem": ${JSON.stringify([arredonda(refugio.lng), arredonda(refugio.lat)])},\n` +
  `  "origemDesvio": ${origemDesvio},\n` +
  '  "rotas": {\n' +
  `${corpo}\n` +
  '  }\n' +
  '}\n';

await writeFile(saida, arquivo, 'utf8');

const longe = Object.entries(rotas).filter(([, r]) => r.desvio > 250);

console.log(`rotas: ${destinos.length} rotas gravadas em src/data/rotas.json`);
console.log(`rotas: origem encaixou a ${origemDesvio} m da estrada`);

if (longe.length) {
  console.log(
    `rotas: ${longe.length} ponto(s) sem estrada até a porta — ` +
      longe.map(([id, r]) => `${id} (${r.desvio} m)`).join(', '),
  );
}
