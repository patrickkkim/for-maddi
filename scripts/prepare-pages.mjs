import { cp, rm, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const source = new URL('../dist/client/', import.meta.url);
const output = new URL('../out/', import.meta.url);
const prefix = process.env.SITE_BASE_PATH || '';
assert(/^([/][a-zA-Z0-9_-]+)*$/.test(prefix), 'SITE_BASE_PATH must be a URL path');
await rm(output, { recursive: true, force: true });
await cp(source, output, { recursive: true });
if (prefix) {
  const nestedAssets = new URL(`${prefix.slice(1)}/`, source);
  for (const entry of await readdir(nestedAssets)) {
    await cp(new URL(entry, nestedAssets), new URL(entry, output), { recursive: true, force: false, errorOnExist: true });
  }
  await rm(new URL(`${prefix.slice(1)}/`, output), { recursive: true });
}
console.log('GitHub Pages artifact prepared in out/.');
