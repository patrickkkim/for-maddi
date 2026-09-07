import { readFile, access } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';

const root = new URL('../out/', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const document = new JSDOM(html).window.document;
assert.match(document.querySelector('h1').textContent, /Maddi/);
assert.equal(document.title, 'A little note');
assert.match(document.querySelector('meta[name="robots"]').content, /noindex/);
const prefix = process.env.SITE_BASE_PATH || '';
const assets = [...document.querySelectorAll('script[src], link[href]')]
  .map((element) => element.getAttribute('src') || element.getAttribute('href'));
assert(assets.length > 0, 'The export must contain application assets');
for (const asset of assets) {
  if (/^https?:/.test(asset)) continue;
  assert(asset.startsWith(`${prefix}/`), `Wrong asset prefix: ${asset}`);
  await access(new URL(asset.slice(prefix.length).replace(/^\//, ''), root));
}
console.log(`Static page and ${assets.length} asset references verified.`);
