import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"] },
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    languageOptions: { 
      globals: {
        ...globals.node,  // Cambiado de browser a node
        process: "readonly"  // Explícitamente permitir process
      } 
    } 
  },
  { files: ["backend/**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] }
]);