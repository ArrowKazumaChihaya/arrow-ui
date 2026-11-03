<script setup lang="ts">
/**
 * ArPills 1.0 — 絞り込みの選択（全員・末永・中口…）。高さ30・丸い札。選んでいる札は淡いテーマ色。
 * 1つ選ぶ（既定）か、multiple でいくつでも。各札は押すたびに切り替わる（aria-pressed）。
 */
import type { ArPillValue, ArPillsProps } from "./ArPills.contract";

const props = withDefaults(defineProps<ArPillsProps>(), { multiple: false, allowClear: false, disabled: false });
const emit = defineEmits<{ "update:modelValue": [value: ArPillValue | null | ArPillValue[]] }>();

const list = () => (Array.isArray(props.modelValue) ? (props.modelValue as ArPillValue[]) : []);
const on = (v: ArPillValue) => (props.multiple ? list().includes(v) : props.modelValue === v);
function press(v: ArPillValue) {
  if (props.multiple) {
    const set = new Set(list());
    if (set.has(v)) set.delete(v);
    else set.add(v);
    emit("update:modelValue", props.options.map((o) => o.value).filter((x) => set.has(x)));
  } else if (props.modelValue === v) {
    if (props.allowClear) emit("update:modelValue", null);
  } else emit("update:modelValue", v);
}
</script>

<template>
  <div data-ar="pills" data-part="root" role="group" :aria-label="label">
    <button
      v-for="o in options"
      :key="String(o.value)"
      type="button"
      data-part="pill"
      :data-state="on(o.value) ? 'on' : undefined"
      :aria-pressed="on(o.value)"
      :disabled="disabled || o.disabled"
      @click="press(o.value)"
    >
      {{ o.label }}<span v-if="o.count !== undefined" data-part="count">{{ o.count }}</span>
    </button>
  </div>
</template>
