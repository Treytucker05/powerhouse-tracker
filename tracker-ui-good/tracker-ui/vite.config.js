import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
const DIRNAME = new URL('.', import.meta.url).pathname

// https://vite.dev/config/
export default defineConfig({
  base: "/powerhouse-tracker/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(DIRNAME, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React and React DOM
          'react-vendor': ['react', 'react-dom'],

          // Chart.js and related
          'chart-vendor': ['chart.js', 'html2canvas', 'jspdf'],

          // UI libraries
          'ui-vendor': [
            '@heroicons/react',
            '@radix-ui/react-tabs',
            'lucide-react'
          ],

          // Data libraries
          'data-vendor': [
            '@supabase/supabase-js',
            '@tanstack/react-query'
          ],

          // DnD Kit
          'dnd-vendor': [
            '@dnd-kit/core',
            '@dnd-kit/sortable',
            '@dnd-kit/utilities'
          ],

          // Router
          'router-vendor': ['react-router-dom']
        }
      }
    },
    // Increase the chunk size warning limit to 1000 kB
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging
    sourcemap: true
  }
})
