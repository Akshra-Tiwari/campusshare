import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,

      // React 17+
      "react/react-in-jsx-scope": "off",

      // Not using PropTypes
      "react/prop-types": "off",

      // Relax these for now
      "no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
      "no-empty": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];