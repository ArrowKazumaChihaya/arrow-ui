<script setup lang="ts">
/**
 * ArCard 1.0 — ひとまとまりの入れ物。
 * variant：band はページの大きなまとまり（テーマ色の帯の見出し）、plain は中の小さなまとまり。
 * slot：default（本文）、actions（見出しの右の操作）、tabs（見出しの下のタブ）。
 */
import ArIcon from "./ArIcon.vue";
import type { ArCardProps } from "./ArCard.contract";

withDefaults(defineProps<ArCardProps>(), { title: undefined, icon: undefined, variant: "plain", flush: false, headingLevel: 2 });
</script>

<template>
  <section data-ar="card" data-part="root" :data-variant="variant" :data-flush="flush || undefined">
    <header v-if="title || $slots.actions" data-part="head">
      <component :is="`h${headingLevel}`" v-if="title" data-part="title">
        <ArIcon v-if="icon" :name="icon" data-part="icon" />{{ title }}
      </component>
      <div v-if="$slots.actions" data-part="actions"><slot name="actions" /></div>
    </header>
    <div v-if="$slots.tabs" data-part="tabs"><slot name="tabs" /></div>
    <div data-part="body"><slot /></div>
  </section>
</template>
