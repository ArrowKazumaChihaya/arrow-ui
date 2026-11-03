<script setup lang="ts">
/**
 * ArDocumentBlock 1.0 — 書類の流れの1つのまとまり。枠の中に指示の見出しと中身、上に「下へ進む」矢印（chevrons）。
 */
import ArIcon from "./ArIcon.vue";
import type { ArDocumentBlockProps } from "./ArDocumentBlock.contract";

withDefaults(defineProps<ArDocumentBlockProps>(), { instruction: undefined, arrow: true });
</script>

<template>
  <section data-ar="document-block" data-part="root">
    <div v-if="arrow" data-part="arrow" aria-hidden="true"><ArIcon name="chevrons" /></div>
    <div data-part="box">
      <p v-if="instruction" data-part="title">{{ instruction }}</p>
      <slot />
    </div>
  </section>
</template>
