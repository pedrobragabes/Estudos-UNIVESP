import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  // Retained, untracked Vite prototype; it is not part of the Next app.
  globalIgnores([".next/**", ".open-next/**", ".study-data/**", ".sources/**", "dist/**", "cloudflare-env.d.ts", "src/App.jsx", "src/GeminiTutor.jsx", "src/FormulaSheet.jsx", "src/main.jsx", "vite.config.js"]),
]);
