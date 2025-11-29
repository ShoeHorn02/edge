import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"
import turboPlugin from "eslint-plugin-turbo"
import tseslint from "typescript-eslint"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: [
      // Build outputs
      "dist/**",
      ".next/**",
      "build/**",
      "out/**",
      // Dependencies
      "node_modules/**",
      // Cache directories
      ".turbo/**",
      ".cache/**",
      // Coverage
      "coverage/**",
      // Storybook
      "storybook-static/**",
      // Other common ignores
      ".vercel/**",
      ".expo/**",
      "*.config.timestamp-*",
    ],
  },
]
