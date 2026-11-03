import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

const at = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// カタログはライブラリのソースを直接読む（作り直さずに確かめられる）
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: /^@arrow\/ui-tokens$/, replacement: at("../../packages/ui-tokens/src/index.ts") },
      { find: /^@arrow\/ui\/skin$/, replacement: at("../../packages/ui/src/skin-entry.ts") },
      { find: /^@arrow\/ui\/requirements$/, replacement: at("../../packages/ui/src/requirements/index.ts") },
      { find: /^@arrow\/ui$/, replacement: at("../../packages/ui/src/index.ts") },
      { find: /^@arrow\/ui-skin-remix$/, replacement: at("../../packages/ui-skin-remix/src/index.ts") },
      { find: /^@arrow\/ui-skin-remix\/styles\.css$/, replacement: at("../../packages/ui-skin-remix/src/styles.css") },
      { find: /^@arrow\/ui-skin-classic$/, replacement: at("../../packages/ui-skin-classic/src/index.ts") },
      { find: /^@arrow\/ui-skin-classic\/styles\.css$/, replacement: at("../../packages/ui-skin-classic/src/styles.css") },
    ],
  },
  server: { port: 5190, host: "127.0.0.1" },
});
