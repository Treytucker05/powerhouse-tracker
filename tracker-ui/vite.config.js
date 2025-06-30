import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: './postcss.config.cjs',   // ← point Vite to the bridge config
  },
  build: {
    rollupOptions: {
      input: 'index.html',           // ignore debug_routes & test.html
    },
  },
})
