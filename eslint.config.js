import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const globals = {
  // Browser globals
  window: "readonly",
  document: "readonly",
  navigator: "readonly",
  console: "readonly",
  setTimeout: "readonly",
  setInterval: "readonly",
  clearTimeout: "readonly",
  clearInterval: "readonly",
  fetch: "readonly",
  localStorage: "readonly",
  sessionStorage: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  Event: "readonly",
  CustomEvent: "readonly",
  alert: "readonly",
  confirm: "readonly",
  prompt: "readonly",
  history: "readonly",
  performance: "readonly",
  AbortController: "readonly",
  WebAssembly: "readonly",
  cancelAnimationFrame: "readonly",
  requestAnimationFrame: "readonly",
  Blob: "readonly",
  TextEncoder: "readonly",
  TextDecoder: "readonly",
  btoa: "readonly",
  atob: "readonly",
  Worker: "readonly",

  // Node globals
  process: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  Buffer: "readonly",
  global: "readonly",

  // Worker globals
  self: "readonly",
  importScripts: "readonly",
  postMessage: "readonly",

  // Custom globals
  monaco: "readonly",
  Go: "readonly",
};

export default [
  {
    ignores: ["dist/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-console": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
