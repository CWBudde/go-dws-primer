import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './public/index.html'
      },
      output: {
        manualChunks: {
          'monaco-editor': ['monaco-editor']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    headers: {
      // Required for WebAssembly
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  optimizeDeps: {
    include: ['monaco-editor']
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'wasm/*',
          dest: 'wasm'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
