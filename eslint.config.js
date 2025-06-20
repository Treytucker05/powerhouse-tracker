/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  /* 1️⃣  Ignore generated output & legacy docs */
  {
    ignores: [
      "dist/**/*",
      "tracker-ui/dist/**/*",
      "node_modules/**/*",
      "docs/**/*",
      "ProgramDesignWorkspace/docs/**/*"
    ],
  },

  /* 2️⃣  Shared language options & globals */
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        vi: "readonly",
        expect: "readonly",
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react: require("eslint-plugin-react"),
      "react-hooks": require("eslint-plugin-react-hooks"),
      vitest: require("eslint-plugin-vitest"),
    },
  },

  /* 3️⃣  Actual rules for source & tests */
  {
    files: [
      "src/**/*.{js,jsx}",
      "lib/**/*.{js,jsx}",
      "tracker-ui/src/**/*.{js,jsx}",
      "tests/**/*.{js,jsx}"
    ],
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    },
  },
];
