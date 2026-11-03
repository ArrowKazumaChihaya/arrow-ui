<script setup lang="ts">
/**
 * ArCompact 1.0 — 部品をすき間なくつなげる（Space.Compact）。角丸は外側だけ残す。
 * 入力＋ボタン、日・週・月のボタンの組、Dropdown.Button など。切り替えには ArSegmented を優先する。
 */
import type { ArCompactProps } from "./ArCompact.contract";

withDefaults(defineProps<ArCompactProps>(), { direction: "horizontal", block: false, label: undefined });
</script>

<template>
  <div
    data-ar="compact"
    data-part="root"
    :data-direction="direction"
    :data-block="block || undefined"
    :role="label ? 'group' : undefined"
    :aria-label="label"
  ><slot /></div>
</template>
