<script setup lang="ts">
/**
 * ArBorderBeam 1.0 — 光の線がふちを回る入れ物。新しい機能の案内などに、1画面1つまで。
 * 色はテーマ色の淡い光。動きを減らす設定（prefers-reduced-motion）では止める。
 */
import type { ArBorderBeamProps } from "./ArBorderBeam.contract";

withDefaults(defineProps<ArBorderBeamProps>(), { duration: 4, active: true });
</script>

<template>
  <div data-ar="border-beam" data-part="root" :data-active="active || undefined" :style="{ '--ar-beam-duration': `${duration}s` }">
    <span data-part="beam" aria-hidden="true" />
    <div data-part="content"><slot /></div>
  </div>
</template>
