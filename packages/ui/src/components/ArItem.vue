<script setup lang="ts">
/**
 * ArItem 1.0 — 項目の行（設定の画面の1行）。左に項目名（幅 titleWidth・必須の印）、右に入力と、その下の補足・「詳細」。
 * 中の入力とは default スロットの値（id・aria-*）を v-bind して結ぶ。項目名を押すと入力へ。
 */
import { computed, useSlots } from "vue";
import { useId } from "../provider/context";
import type { ArItemControlProps, ArItemProps } from "./ArItem.contract";

const props = withDefaults(defineProps<ArItemProps>(), {
  title: undefined,
  required: false,
  requiredText: "必須",
  info: undefined,
  detail: false,
  detailHref: undefined,
  detailText: "詳細",
  titleWidth: "200px",
  id: undefined,
});
const emit = defineEmits<{ detail: [event: MouseEvent] }>();
defineSlots<{ default?(props: ArItemControlProps): unknown; title?(): unknown; info?(): unknown }>();
const slots = useSlots();
const auto = useId("ar-item");
const id = computed(() => props.id ?? auto);
const labelId = `${auto}-label`;
const infoId = `${auto}-info`;
const hasInfo = computed(() => !!(props.info || slots.info || props.detail || props.detailHref));
const control = computed<ArItemControlProps>(() => ({
  id: id.value,
  "aria-labelledby": labelId,
  ...(hasInfo.value ? { "aria-describedby": infoId } : {}),
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
  <div data-ar="item" data-part="root" :style="{ '--ar-item-title': titleWidth }">
    <div data-part="title">
      <label :id="labelId" data-part="label" :for="id" @click="onLabelClick"
        ><span data-part="label-text"><slot name="title">{{ title }}</slot></span
        ><span v-if="required" data-part="required">{{ requiredText }}</span></label
      >
    </div>
    <div data-part="content">
      <slot v-bind="control" />
      <p v-if="hasInfo" :id="infoId" data-part="info">
        <span v-if="info || $slots.info" data-part="info-text"><slot name="info">{{ info }}</slot></span>
        <a v-if="detailHref" data-part="detail" :href="detailHref" target="_blank" rel="noopener">{{ detailText }}</a>
        <button v-else-if="detail" type="button" data-part="detail" @click="emit('detail', $event)">{{ detailText }}</button>
      </p>
    </div>
  </div>
</template>
