<script setup lang="ts">
/**
 * ArDescriptions 1.1 — ラベルと値の一覧（社員の情報・日の要約）。
 * bordered は枠つき（ラベルの地は淡いテーマ色）、plain は枠なしで「出勤人数 8名」のように並べる。
 */
import { computed } from "vue";
import type { ArDescriptionsItem, ArDescriptionsProps } from "./ArDescriptions.contract";

const props = withDefaults(defineProps<ArDescriptionsProps>(), { column: 3, variant: "bordered", layout: "inline", title: undefined, headingLevel: 3 });
const span = (it: ArDescriptionsItem) => Math.max(1, Math.min(it.span ?? 1, props.column));
const cols = computed(() => ({ "--ar-desc-columns": String(props.column) }));
</script>

<template>
  <div data-ar="descriptions" data-part="root" :data-variant="variant" :data-layout="layout">
    <div v-if="title || $slots.extra" data-part="header">
      <component :is="`h${headingLevel}`" v-if="title" data-part="title">{{ title }}</component>
      <div v-if="$slots.extra" data-part="extra"><slot name="extra" /></div>
    </div>
    <dl data-part="list" :style="cols">
      <div
        v-for="it in items"
        :key="it.key"
        data-part="item"
        :data-tone="it.tone"
        :style="(variant === 'plain' || layout === 'stacked') && span(it) > 1 ? { gridColumn: `span ${span(it)}` } : undefined"
      >
        <dt data-part="label"><slot :name="`label-${it.key}`" :item="it">{{ it.label }}</slot></dt>
        <dd data-part="value" :style="variant === 'bordered' && layout === 'inline' && span(it) > 1 ? { gridColumn: `span ${span(it) * 2 - 1}` } : undefined"><slot :name="`item-${it.key}`" :item="it">{{ it.value }}</slot></dd>
      </div>
    </dl>
  </div>
</template>
