import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const DIRNAME = new URL('.', import.meta.url).pathname

// https://vite.dev/config/
export default defineConfig({
  base: '/powerhouse-tracker/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(DIRNAME, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom']
        }
      }
    }
  }
})
