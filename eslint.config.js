import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"

export default tseslint.config(
  {
    ignores: [
      "node_modules",
      ".claude",
      "upstream",
      "dist",
      "coverage",
      "playwright-report",
      "test-results",
      "registry.json",
      "src/styles/digital-agency.css",
      "src/styles/digital-agency.tokens.json",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: [".github/scripts/**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["tests/**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.node, vi: "readonly" },
    },
  },
  {
    // Ambient module augmentation legitimately needs empty interfaces / any.
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  }
)
