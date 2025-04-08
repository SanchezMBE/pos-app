import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  { files: ["backend/**/*.{js,mjs,cjs}"] },
  { 
    files: ["backend/**/*.{js,mjs,cjs}"], 
    languageOptions: { 
      globals: {
        ...globals.node,  // Cambiado de browser a node
        process: "readonly"  // Explícitamente permitir process
      } 
    } 
  },
  { files: ["backend/**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] }
]);