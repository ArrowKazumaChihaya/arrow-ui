<script setup lang="ts">
/**
 * ArExample 1.0 — 例の箱。設定がどう効くかを例で見せる（例を入れると結果が出る）。
 * box は見出しと「項目｜値」の行、inline は「例で確かめる｜入力 → 結果」の1行。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArExampleProps, ArExampleRow } from "./ArExample.contract";

const props = withDefaults(defineProps<ArExampleProps>(), {
  title: undefined,
  tag: undefined,
  rows: () => [],
  variant: "box",
  result: undefined,
  resultIcon: undefined,
  resultTone: "accent",
});
defineSlots<{ default?(): unknown; result?(): unknown; title?(): unknown }>();
const heading = computed(() => props.title ?? (props.variant === "inline" ? "例で確かめる" : "例"));
const keyOf = (r: ArExampleRow) => r.key ?? r.label;
</script>

<template>
  <div v-if="variant === 'inline'" data-ar="example" data-part="root" data-variant="inline" role="group" :aria-label="heading">
    <span data-part="title"><slot name="title">{{ heading }}</slot></span>
    <span data-part="inputs"><slot /></span>
    <span data-part="arrow" aria-hidden="true">→</span>
    <span data-part="result" :data-tone="resultTone" aria-live="polite"
      ><slot name="result"><ArIcon v-if="resultIcon" line :name="resultIcon" size="sm" />{{ result }}</slot></span
    >
  </div>
  <div v-else data-ar="example" data-part="root" data-variant="box" role="note">
    <div data-part="head">
      <ArIcon data-part="head-icon" line name="info" size="sm" />
      <span data-part="title"><slot name="title">{{ heading }}</slot></span>
      <span v-if="tag" data-part="tag">{{ tag }}</span>
    </div>
    <dl v-if="rows.length" data-part="rows">
      <div v-for="r in rows" :key="keyOf(r)" data-part="row">
        <dt data-part="label">{{ r.label }}</dt>
        <dd data-part="value" :data-tone="r.tone">{{ r.value }}</dd>
      </div>
    </dl>
    <slot />
  </div>
</template>
