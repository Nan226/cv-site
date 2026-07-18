import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of ['index.html', 'css', 'js', 'assets']) {
  await cp(resolve(root, entry), resolve(output, entry), { recursive: true });
}

await writeFile(resolve(output, '_headers'), `
/assets/*
  Cache-Control: public, max-age=2592000

/css/*
  Cache-Control: public, max-age=604800

/js/*
  Cache-Control: public, max-age=604800

/index.html
  Cache-Control: no-cache
`.trimStart());

console.log('Built Cloudflare Pages output in dist/.');
