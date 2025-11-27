import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: 'jsdom',
        threads: false,
        pool: 'forks',
        watch: false,
        reporters: ['dot'],
        sequence: { concurrent: false },
        testTimeout: 20000,
        hookTimeout: 20000,
        teardownTimeout: 10000,
        setupFiles: ['src/test/setup.ts'],
        isolate: true,
        include: [
            'src/**/*.test.{ts,tsx,js,jsx}',
            'src/**/__tests__/**/*.{ts,tsx,js,jsx}',
            'src/**/tests/**/*.{ts,tsx,js,jsx}',
        ],
        exclude: ['node_modules', 'dist', '**/*.e2e.*'],
        deps: {
            inline: ['@testing-library/react', '@testing-library/react-hooks', '@tanstack/react-query'],
        },
        css: false,
        restoreMocks: true,
        clearMocks: true,
        mockReset: true,
    },
});
