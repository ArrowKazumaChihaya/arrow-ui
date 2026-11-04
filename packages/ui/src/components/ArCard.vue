<script setup lang="ts">
/**
 * ArCard 1.1 — ひとまとまりの入れ物。
 * band はページの大きなまとまり（テーマ色の帯の見出し・帯のすぐ下にタブの帯）。
 * elevated・outlined・plain は中の小さなまとまり（影・線・小さな線の箱）。
 * slot：default（本文）、actions（見出しの右）、tabs（帯の下のタブ）、cover（上の絵）、footer（下のアイコンの操作）。
 */
import ArIcon from "./ArIcon.vue";
import type { ArCardProps } from "./ArCard.contract";

withDefaults(defineProps<ArCardProps>(), {
  title: undefined,
  icon: undefined,
  variant: "outlined",
  size: "md",
  flush: false,
  headingLevel: 2,
});
</script>

<template>
  <section data-ar="card" data-part="root" :data-variant="variant" :data-size="size" :data-flush="flush || undefined">
    <div v-if="$slots.cover" data-part="cover"><slot name="cover" /></div>
    <header v-if="title || $slots.title || $slots.actions" data-part="head">
      <component :is="`h${headingLevel}`" v-if="title || $slots.title" data-part="title">
        <ArIcon v-if="icon" :name="icon" data-part="icon" /><slot name="title">{{ title }}</slot>
      </component>
      <div v-if="$slots.actions" data-part="actions"><slot name="actions" /></div>
    </header>
    <div v-if="$slots.tabs" data-part="tabs"><slot name="tabs" /></div>
    <div data-part="body"><slot /></div>
    <footer v-if="$slots.footer" data-part="footer"><slot name="footer" /></footer>
  </section>
</template>
