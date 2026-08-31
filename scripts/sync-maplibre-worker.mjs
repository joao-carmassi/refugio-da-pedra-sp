/**
 * Copies the MapLibre worker bundle into `public/mapa-worker/` so the map can
 * run without pulling the worker from a third-party CDN at runtime.
 *
 * `src/components/ui/map.tsx` (the mapcn registry component) points
 * `setWorkerUrl` at `/mapa-worker/maplibre-gl-worker.mjs`. The worker imports
 * `maplibre-gl-shared.mjs` from the same directory, so both files must be
 * copied together and stay on the same version.
 *
 * A pasta `mapa-worker/`, e não a raiz de `public/`, por causa do service
 * worker. Script de worker é requisição de documento, não de subrecurso: o
 * navegador procura quem a controla comparando a URL do *próprio worker* com o
 * escopo registrado, e não o escopo de quem o criou. Na raiz, `/maplibre-gl-
 * worker.mjs` fica fora do `/mapa` e escapa do service worker — offline ele não
 * carregaria, e sem ele nenhum tile vetorial é decodificado: mapa em branco com
 * o cache cheio. Sob o prefixo do mapa, worker e código compartilhado entram no
 * escopo junto com o resto.
 *
 * Runs automatically after `npm install` via the `postinstall` script — bumping
 * `maplibre-gl` therefore refreshes the copies with no extra step.
 */
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(root, 'node_modules', 'maplibre-gl', 'dist');
const to = join(root, 'public', 'mapa-worker');

const files = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'];

await mkdir(to, { recursive: true });

for (const file of files) {
  await copyFile(join(from, file), join(to, file));
  console.log(`maplibre: copied ${file} -> public/mapa-worker/`);
}
