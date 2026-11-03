<script setup lang="ts">
/**
 * ArSpin 1.0 — テーマ色の回る輪。中身（default slot）を包むと、読み込み中は中身の上に白い幕と輪を重ねる。
 */
import type { ArSpinProps } from "./ArSpin.contract";

withDefaults(defineProps<ArSpinProps>(), { spinning: true, size: "md", tip: undefined });
</script>

<template>
  <div v-if="$slots.default" data-ar="spin" data-part="root" data-wrap :data-size="size" :aria-busy="spinning">
    <div data-part="content" :inert="spinning || undefined"><slot /></div>
    <div v-if="spinning" data-part="mask" role="status" :aria-label="tip ?? '読み込み中'">
      <span data-part="spinner" aria-hidden="true" />
      <span v-if="tip" data-part="tip">{{ tip }}</span>
    </div>
  </div>
  <span v-else-if="spinning" data-ar="spin" data-part="root" :data-size="size" role="status" :aria-label="tip ?? '読み込み中'">
    <span data-part="spinner" aria-hidden="true" />
    <span v-if="tip" data-part="tip">{{ tip }}</span>
  </span>
</template>
