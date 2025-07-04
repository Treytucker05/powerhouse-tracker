import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'
import path from 'path'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.join(__dirname, '.env.test') })
}

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
