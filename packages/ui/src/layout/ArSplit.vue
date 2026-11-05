<script setup lang="ts">
/**
 * ArSplit 1.0 — 左右に分ける。左の幅は段階（sm 320 / md 420 / lg 540 / xl 640）。
 * 置かれた場所の幅が stackBelow より狭いと、上下に積む（コンテナクエリ）。
 */
import type { ArSpace } from "./types";
withDefaults(
  defineProps<{
    start?: "sm" | "md" | "lg" | "xl";
    /** 幅を固定する側。end は本文の右に補助欄を置く。幅の段階は start を使う。 */
    fixed?: "start" | "end";
    gap?: ArSpace;
    stackBelow?: "sm" | "md" | "lg" | "xl";
    align?: "start" | "stretch";
  }>(),
  { start: "md", fixed: "start", gap: 6, stackBelow: "lg", align: "start" },
);
</script>

<template>
  <div data-ar="split" :data-stack-below="stackBelow">
    <div data-part="track" :data-start="start" :data-fixed="fixed" :data-gap="gap" :data-align="align">
      <div data-part="start"><slot name="start" /></div>
      <div data-part="end"><slot name="end" /></div>
    </div>
  </div>
</template>
