<script setup lang="ts">
/**
 * ArIcon 1.0 — ARROW のアイコン。ふだんはライブラリの線のアイコン。
 * デザインがその名前の絵（ArDesign.icons）を持っていれば、その絵を描く（例：classic は今の ARROW の塗りの絵）。
 * 部品の中の印（開閉の∨・閉じる×・チェックの✓・ページ送りの‹› など）は line を付けて、いつも線で描く
 * （classic でも今の ARROW はそこに antd の印を使っていて、ARROW の塗りの絵ではないため）。
 * label を渡すと読み上げられる画像、渡さなければ飾り（aria-hidden）。
 */
import { computed } from "vue";
import { icons, type ArIconName } from "../icons";
import { useArUi } from "../provider/context";

const props = withDefaults(
  defineProps<{
    name: ArIconName;
    size?: "sm" | "md" | "lg";
    label?: string;
    /** デザインの絵（ArDesign.icons）を使わず、いつもライブラリの線で描く。部品の中の印に使う。 */
    line?: boolean;
  }>(),
  { size: "md", label: undefined, line: false },
);
const ui = useArUi();

/** デザインの絵（<svg viewBox="…">中身</svg>）を viewBox と中身に分ける。同じ文字列は1回だけ分ける。 */
const parsed = new Map<string, { viewBox: string; body: string }>();
function parse(svg: string) {
  let hit = parsed.get(svg);
  if (!hit) {
    const open = svg.indexOf(">");
    const head = svg.slice(0, open);
    hit = {
      viewBox: /\bviewBox="([^"]+)"/.exec(head)?.[1] ?? "0 0 24 24",
      body: svg.slice(open + 1, svg.lastIndexOf("</svg>")),
    };
    parsed.set(svg, hit);
  }
  return hit;
}
const drawn = computed(() => {
  const svg = props.line ? undefined : ui?.design.value.icons?.[props.name];
  return svg ? parse(svg) : null;
});
</script>

<template>
  <svg
    v-if="drawn"
    data-ar="icon"
    data-source="design"
    :data-size="size"
    :viewBox="drawn.viewBox"
    fill="currentColor"
    stroke="none"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
    v-html="drawn.body"
  />
  <svg
    v-else
    data-ar="icon"
    :data-size="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
    v-html="icons[name]"
  />
</template>
