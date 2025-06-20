import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  {
    ignores: [
      'js/**',
      'tests/**',
      'node_modules/**'
    ]
  },
  js.configs.recommended,
  {
    plugins: { react: pluginReact, 'react-hooks': pluginReactHooks },
    languageOptions: {
      parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.node,
        vi: true,
        vitest: true,
        expect: true,
        describe: true,
        it: true,
        test: true,
        beforeAll: true,
        afterAll: true,
        jest: true,
        beforeEach: true,
        afterEach: true
      }
    },
    rules: {
      // lint fails on any warning
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react/react-in-jsx-scope': 'off',
      'no-undef': 'off'
    },
    settings: { react: { version: 'detect' } }
  }
];
