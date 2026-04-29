// Prepends 'use client'; to the entry bundles so they work in Next.js App Router
// without the consumer needing to add their own boundary. Necessary because
// esbuild strips top-level directives during bundling (and the tsup `banner`
// option produces a directive that rollup/esbuild then strips with the
// "Module level directives cause errors when bundled" warning).
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const targets = ['index.mjs', 'index.cjs'];
const directive = "'use client';\n";

for (const file of targets) {
  const path = resolve(distDir, file);
  const original = await readFile(path, 'utf8');
  if (original.startsWith("'use client'")) continue;
  await writeFile(path, directive + original, 'utf8');
}
