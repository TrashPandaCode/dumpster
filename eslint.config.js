/*
 * Authors: Leo Kling, Jonathan Kron
 *
 * Purpose:
 * This code configures ESLint with recommended JavaScript and TypeScript rules, adds React Hooks and React Refresh plugins with custom rules,
 * sets browser globals, ignores the `dist` folder, and integrates Prettier for code formatting.
 */
import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": ["warn"],
    },
  },
  // Add Prettier config last to override formatting rules
  prettierConfig,
];
