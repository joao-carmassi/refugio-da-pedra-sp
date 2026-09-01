/**
 * Copies the MapLibre worker bundle into `public/` so the map can run without
 * pulling the worker from a third-party CDN at runtime.
 *
 * `src/components/ui/map.tsx` (the mapcn registry component) points
 * `setWorkerUrl` at `/maplibre-gl-worker.mjs`. The worker imports
 * `maplibre-gl-shared.mjs` from the same directory, so both files must be
 * copied together and stay on the same version.
 *
 * Runs automatically after `npm install` via the `postinstall` script — bumping
 * `maplibre-gl` therefore refreshes the copies with no extra step.
 */
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(root, 'node_modules', 'maplibre-gl', 'dist');
const to = join(root, 'public');

const files = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'];

await mkdir(to, { recursive: true });

for (const file of files) {
  await copyFile(join(from, file), join(to, file));
  console.log(`maplibre: copied ${file} -> public/`);
}
