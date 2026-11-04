export const install = `npm i @s_and_a/arrow-ui @s_and_a/arrow-ui-design-remix
npm i -D @s_and_a/eslint-plugin-arrow-ui`;

export const viteAlias = `// 当てるデザインのライブラリは、ここ1か所で決める
const design = process.env.ARROW_DESIGN === "classic" ? "@s_and_a/arrow-ui-design-classic" : "@s_and_a/arrow-ui-design-remix";
export default defineConfig({
  resolve: { alias: [{ find: /^@s_and_a\\/arrow-ui-design$/, replacement: design }] },
});`;

export const appVue = `<script setup lang="ts">
import { ArUiProvider } from "@s_and_a/arrow-ui";
import design from "@s_and_a/arrow-ui-design";
import requires from "../arrow-ui.requires";
</script>

<template>
  <ArUiProvider :design="design" :requires="requires">
    <RouterView />
  </ArUiProvider>
</template>`;

export const mainTs = `import "@s_and_a/arrow-ui/style.css";`;

export const requiresTs = `import { defineRequirements } from "@s_and_a/arrow-ui/requirements";
import { remixDesign } from "@s_and_a/arrow-ui-design-remix";
import { classicDesign } from "@s_and_a/arrow-ui-design-classic";

export default defineRequirements({
  components: {
    ArButton: "^1.0",
    ArTimeInput: "^1.0", // 前日の切り替え（dayShift）を使う
    ArTable: "^1.0",
  },
  // 切り替える可能性のあるデザインはすべて並べる
  designs: [remixDesign, classicDesign],
});`;

export const eslintrc = `module.exports = {
  plugins: ["@s_and_a/arrow-ui"],
  extends: ["plugin:@s_and_a/arrow-ui/recommended"],
};`;

export const cliOut = `$ npx arrow-ui check
arrow-ui.requires.ts を確かめています…
✗ design「next」：見た目を用意していない部品があります: ArTimeInput
✗ design「next」：ArTable の版が足りません（宣言 ^1.1・デザイン 1.0.0）`;

export const layoutVue = `<!-- src/Layout/ShiftDetailLayout.vue（製品のレイアウト層：余白と配置だけ） -->
<template>
  <ArStack :gap="5">
    <slot name="summary" />
    <ArCluster justify="between" :gap="2">
      <slot name="actions" /><slot name="search" />
    </ArCluster>
    <slot />
  </ArStack>
</template>`;

export const scopeSelf = `<!-- 説明の画面のように、2つのデザインを1枚に並べるとき -->
<ArUiProvider :design="remixDesign" scope="self">…</ArUiProvider>
<ArUiProvider :design="classicDesign" scope="self">…</ArUiProvider>`;

export const themeScope = `<ArUiProvider :design="design" palette="blue">
  <ArThemeScope palette="green"><AttendancePage /></ArThemeScope>
</ArUiProvider>`;

export const defineDesignTs = `import { defineDesign } from "@s_and_a/arrow-ui/design";

export const nextDesign = defineDesign({
  id: "next",
  label: "次のデザイン",
  tokens: { /* すべてのトークンの値 */ },
  palettes: { /* 7つのテーマ色の組 */ },
  covers: { ArButton: "1.0.0" /* 見た目を作ったすべての部品と契約の版 */ },
  styles: () => import("@s_and_a/arrow-ui-design-next/styles.css"),
});`;

export const designCssExample = `/* デザインの CSS は data-ar と data-part だけを相手にする */
[data-ar-design="remix"] [data-ar="button"][data-tone="primary"] {
  background: var(--ar-accent);
  color: var(--ar-on-accent);
}
[data-ar-design="remix"] [data-ar="card"] > [data-part="head"] { … }`;
