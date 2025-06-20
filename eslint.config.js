import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: [
      // legacy bundles, screenshots, etc.
      "docs/**",
      "tracker-ui/dist/**",   // ignore Vite build artifacts
      "**/*.min.js"
    ],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn"
    },
  }
]
