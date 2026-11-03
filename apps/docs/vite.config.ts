import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

const at = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// 説明の画面はライブラリのソースを直接読む。ビルドは1つの JS と1つの CSS にまとめる（artifact.mjs で1枚の HTML にする）
export default defineConfig({
  plugins: [vue()],
  base: "./",
  resolve: {
    alias: [
      { find: /^@arrow\/ui-tokens$/, replacement: at("../../packages/ui-tokens/src/index.ts") },
      { find: /^@arrow\/ui\/design$/, replacement: at("../../packages/ui/src/design-entry.ts") },
      { find: /^@arrow\/ui\/requirements$/, replacement: at("../../packages/ui/src/requirements/index.ts") },
      { find: /^@arrow\/ui$/, replacement: at("../../packages/ui/src/index.ts") },
      { find: /^@arrow\/ui-design-remix$/, replacement: at("../../packages/ui-design-remix/src/index.ts") },
      { find: /^@arrow\/ui-design-remix\/styles\.css$/, replacement: at("../../packages/ui-design-remix/src/styles.css") },
      { find: /^@arrow\/ui-design-classic$/, replacement: at("../../packages/ui-design-classic/src/index.ts") },
      { find: /^@arrow\/ui-design-classic\/styles\.css$/, replacement: at("../../packages/ui-design-classic/src/styles.css") },
    ],
  },
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    rollupOptions: { output: { codeSplitting: false, entryFileNames: "docs.js", assetFileNames: "docs.[ext]" } },
  },
  server: { port: 5191, host: "127.0.0.1" },
});
