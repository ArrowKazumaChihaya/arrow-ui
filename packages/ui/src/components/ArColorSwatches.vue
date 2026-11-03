<script setup lang="ts">
/**
 * ArColorSwatches 1.0 — 決まった色から1つ選ぶ（イベント・パターンの色）。26px・角丸6。
 * 選んでいる色は白と濃い色の2重の輪。キーボード：←→↑↓で選ぶ（ラジオと同じ）。
 */
import { computed, ref } from "vue";
import { arEventColors } from "./color";
import type { ArColorSwatchesProps } from "./ArColorSwatches.contract";

const props = withDefaults(defineProps<ArColorSwatchesProps>(), { colors: () => arEventColors, size: "md", disabled: false });
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
const root = ref<HTMLElement | null>(null);
const same = (a: string | null, b: string) => !!a && a.toUpperCase() === b.toUpperCase();
const index = computed(() => props.colors.findIndex((c) => same(props.modelValue, c.value)));

function onKey(i: number, e: KeyboardEvent) {
  const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  let next = i;
  if (dir) next = (i + dir + props.colors.length) % props.colors.length;
  else if (e.key === "Home") next = 0;
  else if (e.key === "End") next = props.colors.length - 1;
  else if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    emit("update:modelValue", props.colors[i]!.value);
    return;
  } else return;
  e.preventDefault();
  emit("update:modelValue", props.colors[next]!.value);
  root.value?.querySelectorAll<HTMLElement>('[data-part="swatch"]')[next]?.focus();
}
</script>

<template>
  <div ref="root" data-ar="color-swatches" data-part="root" role="radiogroup" :aria-label="label" :data-size="size" :aria-disabled="disabled || undefined">
    <button
      v-for="(c, i) in colors"
      :key="c.value"
      type="button"
      role="radio"
      data-part="swatch"
      :style="{ background: c.value }"
      :aria-checked="same(modelValue, c.value)"
      :aria-label="c.label"
      :title="c.label"
      :tabindex="i === (index < 0 ? 0 : index) ? 0 : -1"
      :data-state="same(modelValue, c.value) ? 'selected' : undefined"
      :disabled="disabled"
      @click="emit('update:modelValue', c.value)"
      @keydown="onKey(i, $event)"
    />
  </div>
</template>
