import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: './vitest.setup.js',
        testTimeout: 15000, // 15 seconds max per test
        hookTimeout: 10000, // 10 seconds for hooks
        teardownTimeout: 5000, // 5 seconds for cleanup
        reporter: ['verbose', 'hanging-process'],
        pool: 'forks', // Better isolation
        logHeapUsage: true,
        maxConcurrency: 1, // Run tests one at a time for better debugging
        sequence: {
            shuffle: false // Keep consistent order
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
