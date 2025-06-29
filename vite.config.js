import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: 'index.html'
    },
    outDir: 'dist'
  },
  server: {
    port: 5173
  }
})
