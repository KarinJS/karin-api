import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  unbundle: false,
  dts: false, 
  clean: true, 
  minify: true, 
  shims: true, 
  target: 'node22', 
  sourcemap: false, 
  treeshake: true, 
  platform: 'node', 
  outDir: 'dist',
})