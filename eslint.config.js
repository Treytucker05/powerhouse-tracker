import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
                Chart: 'readonly',
                showSystemMessage: 'readonly',
                createSystemOutput: 'readonly',
                updateAllDisplays: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': 'warn'
        }
    },
    {
        files: ['**/__tests__/**', 'tests/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest
            }
        },
        rules: {
            'no-unused-vars': 'off',
            'no-undef': 'off'
        }
    }
];