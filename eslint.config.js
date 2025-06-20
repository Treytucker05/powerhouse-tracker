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
  // Configuration for regular JS files
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn"
    },
  },
  // Skip JSX files for now since we need React plugin
  {
    files: ["**/*.jsx"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        React: "readonly"
      }
    },
    rules: {
      // Minimal rules for JSX files
      "no-unused-vars": "warn"
    },
  }
]
