import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  eslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      globals: {
        ...globals.node,
        ...globals.es2020,
      },
      sourceType: "module",
      ecmaVersion: 2020,
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "prettier/prettier": "error",
    },
  },
  prettierConfig,
  {
    ignores: ["dist/", "node_modules/"],
  },
];
