import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server: {
    port: 5173
  },
  optimizeDeps: {
    exclude: [
      'test-event-listeners.html',
      'test-rir-system.html', 
      'test-toggle.html'
    ]
  }
})
