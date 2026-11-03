<script setup lang="ts">
/**
 * ArDaySummary 1.0 — 日の要約の札の並び（シフト画面の日付の下）。
 * 札は「見出し＋太字の値」。最後に公開の切り替えの札（押すと公開中⇄非公開）を置ける。
 */
import ArIcon from "./ArIcon.vue";
import type { ArDaySummaryProps } from "./ArDaySummary.contract";

const props = withDefaults(defineProps<ArDaySummaryProps>(), {
  items: () => [],
  published: undefined,
  publishDisabled: false,
  align: "center",
  labels: () => ({ published: "公開中", unpublished: "非公開", toggleHint: "押すと切り替わります" }),
});
const emit = defineEmits<{ "update:published": [value: boolean] }>();
function toggle() {
  if (props.publishDisabled || props.published === undefined) return;
  emit("update:published", !props.published);
}
</script>

<template>
  <div data-ar="day-summary" data-part="root" :data-align="align">
    <span v-for="(it, i) in items" :key="i" data-part="item" :data-tone="it.tone ?? 'neutral'">
      <ArIcon v-if="it.icon" :name="it.icon" data-part="icon" />
      <span data-part="label">{{ it.label }}</span>
      <b v-if="it.value" data-part="value">{{ it.value }}</b>
    </span>
    <button
      v-if="published !== undefined"
      type="button"
      data-part="publish"
      :data-state="[published ? 'on' : 'off', publishDisabled && 'disabled'].filter(Boolean).join(' ')"
      :aria-pressed="published ? 'true' : 'false'"
      :disabled="publishDisabled"
      :title="publishDisabled ? undefined : labels.toggleHint"
      @click="toggle"
    >
      <ArIcon :name="published ? 'eye' : 'eyeoff'" data-part="icon" />
      <span data-part="label">{{ published ? labels.published : labels.unpublished }}</span>
    </button>
  </div>
</template>
