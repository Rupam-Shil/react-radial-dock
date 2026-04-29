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
    splitting: false,
    external: ['react', 'react-dom', 'gsap'],
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
