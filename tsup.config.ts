import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts', presets: 'src/presets/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: false,
    minify: false,
    treeshake: true,
    external: ['react', 'react-dom', 'gsap'],
    banner: { js: "'use client';" },
    outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.cjs' }),
  },
  {
    entry: ['src/styles.css'],
    outDir: 'dist',
    format: ['esm'],
    clean: false,
    loader: { '.css': 'copy' },
  },
]);
