<script setup lang="ts">
/**
 * ArSubItem 1.0 — 小さな項目（上に項目名・必須の印、下に入力）。項目の中で入力を名前つきで並べるときに使う。
 * 中の入力とは default スロットの値（id・aria-*）を v-bind して結ぶ。
 */
import { computed } from "vue";
import { useId } from "../provider/context";
import type { ArSubItemControlProps, ArSubItemProps } from "./ArSubItem.contract";

const props = withDefaults(defineProps<ArSubItemProps>(), {
  title: undefined,
  required: false,
  requiredText: "必須",
  showTitle: true,
  id: undefined,
});
defineSlots<{ default?(props: ArSubItemControlProps): unknown; title?(): unknown }>();
const auto = useId("ar-sub-item");
const id = computed(() => props.id ?? auto);
const labelId = `${auto}-label`;
const control = computed<ArSubItemControlProps>(() => ({
  id: id.value,
  ...(props.showTitle ? { "aria-labelledby": labelId } : {}),
  ...(props.required ? { "aria-required": "true" as const } : {}),
}));
function onLabelClick(e: MouseEvent) {
  const el = document.getElementById(id.value);
  if (!el || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(el.tagName)) return;
  e.preventDefault();
  el.focus();
}
</script>

<template>
  <div data-ar="sub-item" data-part="root" :data-no-title="!showTitle || undefined">
    <div v-if="showTitle" data-part="title">
      <label :id="labelId" data-part="label" :for="id" @click="onLabelClick"
        ><span data-part="label-text"><slot name="title">{{ title }}</slot></span
        ><span v-if="required" data-part="required">{{ requiredText }}</span></label
      >
    </div>
    <div data-part="content"><slot v-bind="control" /></div>
  </div>
</template>
