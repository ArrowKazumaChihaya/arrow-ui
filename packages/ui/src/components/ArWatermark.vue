<script setup lang="ts">
/**
 * ArWatermark 1.0 — 中身の上に、うすい文字を斜めに並べる（給与・書類の画面）。
 * 文字の形だけをここで作り、色はデザインが決める（remix はうすい ink 10%）。押す操作は下の中身に通る。
 */
import { computed } from "vue";
import type { ArWatermarkProps } from "./ArWatermark.contract";

const props = withDefaults(defineProps<ArWatermarkProps>(), { rotate: -22, gapX: 200, gapY: 110, fontSize: 14 });
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const mask = computed(() => {
  const lines = (typeof props.content === "string" ? [props.content] : [...props.content]).filter(Boolean);
  const w = props.gapX;
  const h = props.gapY;
  const lh = props.fontSize * 1.4;
  const y0 = h / 2 + 5 - ((lines.length - 1) * lh) / 2;
  const text = lines
    .map((l, i) => `<text x="10" y="${(y0 + i * lh).toFixed(1)}" font-family="sans-serif" font-size="${props.fontSize}">${esc(l)}</text>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g transform="rotate(${props.rotate} ${w / 2} ${h / 2})">${text}</g></svg>`;
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return { maskImage: url, WebkitMaskImage: url, maskSize: `${w}px ${h}px`, WebkitMaskSize: `${w}px ${h}px` };
});
</script>

<template>
  <div data-ar="watermark" data-part="root">
    <slot />
    <div data-part="mark" aria-hidden="true" :style="mask" />
  </div>
</template>
