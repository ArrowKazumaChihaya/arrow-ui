<script setup lang="ts">
/**
 * ArMessageHost 1.0 — useArMessage() で出した言葉を、画面の上の真ん中に並べる入れ物。
 * 製品が ArUiProvider の中（テーマ色の効く場所）に1つ置く。
 */
import ArMessage from "./ArMessage.vue";
import { arMessageStore } from "../feedback";
import type { ArMessageHostProps } from "./ArMessageHost.contract";

withDefaults(defineProps<ArMessageHostProps>(), { top: undefined });
</script>

<template>
  <div data-ar="message-host" data-part="root" aria-live="polite" :style="top !== undefined ? { top: `${top}px` } : undefined">
    <TransitionGroup name="ar-message">
      <ArMessage v-for="m in arMessageStore" :key="m.key" :tone="m.tone" :content="m.content" />
    </TransitionGroup>
  </div>
</template>
