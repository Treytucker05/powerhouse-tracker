import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'node:url';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: 'jsdom',
        pool: 'forks',
        maxWorkers: 1,
        hookTimeout: 2000,
        teardownTimeout: 2000,
        isolate: true,
        restoreMocks: true,
        clearMocks: true,
        mockReset: true,
        reporters: [['default', { summary: false }]],
        setupFiles: ['src/test/setup.ts'],
        include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
        exclude: ['node_modules', 'dist', 'build']
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@packs': fileURLToPath(new URL('./src/packs', import.meta.url))
        }
    },
    esbuild: { jsx: 'automatic' }
});
