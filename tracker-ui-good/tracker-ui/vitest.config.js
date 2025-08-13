import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.js'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**', '**/*.e2e.*', 'e2e/**'],
        testTimeout: 15000,
        hookTimeout: 10000,
        teardownTimeout: 5000,
        reporter: ['verbose', 'hanging-process'],
        pool: 'forks',
        logHeapUsage: true,
        maxConcurrency: 1,
        sequence: { shuffle: false }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
