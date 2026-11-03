import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: { index: "src/index.ts", design: "src/design-entry.ts", requirements: "src/requirements/index.ts" },
      formats: ["es"],
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ["vue", "@arrow/ui-tokens"],
      output: { assetFileNames: "style.css" },
    },
  },
});
