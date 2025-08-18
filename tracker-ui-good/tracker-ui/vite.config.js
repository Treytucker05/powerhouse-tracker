import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
const DIRNAME = new URL('.', import.meta.url).pathname

export default defineConfig({
  base: '/powerhouse-tracker/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(DIRNAME, "./src"),
      "@lib": path.resolve(DIRNAME, './src/lib'),
      "@packs": path.resolve(DIRNAME, './src/packs'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['chart.js', 'html2canvas', 'jspdf'],
          'ui-vendor': [
            '@heroicons/react',
            '@radix-ui/react-tabs',
            'lucide-react'
          ],
          'data-vendor': [
            '@supabase/supabase-js',
            '@tanstack/react-query'
          ],
          'dnd-vendor': [
            '@dnd-kit/core',
            '@dnd-kit/sortable',
            '@dnd-kit/utilities'
          ],
          'router-vendor': ['react-router-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true
  }
})
