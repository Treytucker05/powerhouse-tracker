import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

// Locked-down Vitest config: limit discovery to src, exclude e2e & root duplicates, stable Windows single-thread.
export default defineConfig({
    // Ensure project root is this directory (prevents walking up and pulling in sibling test folders)
    root: fileURLToPath(new URL('./', import.meta.url)),
    plugins: [react()],
    test: {
        environment: 'jsdom',
    testTimeout: 15000,
    hookTimeout: 15000,
        include: [
            'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
            'src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        ],
        exclude: [
            'node_modules/**',
            'dist/**',
            'build/**',
            'coverage/**',
            '.vitest-coverage/**',
            'e2e/**',
            '**/e2e/**',
            'tests/**',
            '__tests__/**', // root-level duplicates outside src
            '**/*.e2e.{test,spec}.**',
        ],
        setupFiles: ['src/tests/setupTests.ts'],
        threads: false,
        restoreMocks: true,
        css: false,
        reporters: [
            [ 'default', { summary: false } ]
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            reportsDirectory: '.vitest-coverage',
            exclude: [
                'src/**/__tests__/**',
                'src/tests/**',
                'src/**/mocks/**',
                '**/*.d.ts',
                '**/*.stories.*',
                '**/e2e/**',
            ],
            all: false,
            thresholds: {
                100: false,
                statements: 80,
                branches: 70,
                functions: 75,
                lines: 80
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
        dedupe: ['react', 'react-dom']
    }
});
