<script setup lang="ts">
/**
 * ArSelect 1.0 — 選択肢から1つ選ぶ。
 * いまは端末の標準の選択（キーボード・スマホで確実に使える）を使い、見た目だけをデザインで変える。
 * 探す欄つき・複数選択は ArCombobox（あとで足す）で扱う。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArSelectValue, ArSelectOption, ArSelectGroup, ArSelectProps } from "./ArSelect.contract";

const props = withDefaults(defineProps<ArSelectProps>(), {
  placeholder: undefined,
  size: "md",
  invalid: false,
  disabled: false,
  block: false,
  label: undefined,
  id: undefined,
});
const emit = defineEmits<{ "update:modelValue": [value: ArSelectValue | null] }>();

const isGroup = (o: ArSelectOption | ArSelectGroup): o is ArSelectGroup => "options" in o;
const flat = computed(() => props.options.flatMap((o) => (isGroup(o) ? o.options : [o])));
const index = computed(() => flat.value.findIndex((o) => o.value === props.modelValue));
function onChange(e: Event) {
  const v = (e.target as HTMLSelectElement).value;
  emit("update:modelValue", v === "" ? null : (flat.value[Number(v)]?.value ?? null));
}
const indexOf = (o: ArSelectOption) => flat.value.indexOf(o);
</script>

<template>
  <span
    data-ar="select"
    data-part="root"
    :data-size="size"
    :data-block="block || undefined"
    :data-state="[invalid && 'invalid', disabled && 'disabled', index < 0 && 'empty'].filter(Boolean).join(' ') || undefined"
  >
    <select
      :id="id"
      data-part="select"
      :disabled="disabled"
      :aria-label="id ? undefined : label"
      :aria-invalid="invalid ? 'true' : undefined"
      :value="index < 0 ? '' : String(index)"
      @change="onChange"
    >
      <option v-if="placeholder !== undefined || index < 0" value="">{{ placeholder ?? "" }}</option>
      <template v-for="o in options" :key="isGroup(o) ? `g-${o.label}` : String(o.value)">
        <optgroup v-if="isGroup(o)" :label="o.label">
          <option v-for="c in o.options" :key="String(c.value)" :value="String(indexOf(c))" :disabled="c.disabled">{{ c.label }}</option>
        </optgroup>
        <option v-else :value="String(indexOf(o))" :disabled="o.disabled">{{ o.label }}</option>
      </template>
    </select>
    <ArIcon name="cd" data-part="arrow" size="sm" />
  </span>
</template>
