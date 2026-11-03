<script setup lang="ts">
/**
 * ArChangedValue 1.0 — 変更前→変更後。変わっていなければ今の値だけを出す。
 * 読み上げでは「変更前 … 変更後 …」と読む（矢印は飾り）。
 */
import { computed } from "vue";
import type { ArChangedValueProps } from "./ArChangedValue.contract";

const props = withDefaults(defineProps<ArChangedValueProps>(), {
  before: null,
  after: null,
  changed: null,
  empty: "—",
  labels: () => ({ before: "変更前", after: "変更後" }),
});
const show = (v: string | number | null | undefined) => (v === null || v === undefined || v === "" ? props.empty : String(v));
const isChanged = computed(() => props.changed ?? show(props.before) !== show(props.after));
</script>

<template>
  <span data-ar="changed-value" data-part="root" :data-state="isChanged ? 'changed' : undefined">
    <template v-if="isChanged">
      <span data-ar-visually-hidden>{{ labels.before }}</span>
      <s data-part="before">{{ show(before) }}</s>
      <span data-part="arrow" aria-hidden="true">→</span>
      <span data-ar-visually-hidden>{{ labels.after }}</span>
      <span data-part="after">{{ show(after) }}</span>
    </template>
    <span v-else data-part="after">{{ show(after) }}</span>
  </span>
</template>
