<script setup lang="ts">
/**
 * ArTabs 1.0 — タブ。中身の出し分けは使う側が modelValue で行う。
 * variant：band はカードの頭（帯）に置くタブ、line はカードの中の下線のタブ。
 * ←→ で移り、Home / End で端へ。
 */
import { nextTick, ref } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArTabsProps } from "./ArTabs.contract";

const props = withDefaults(defineProps<ArTabsProps>(), { variant: "line", idPrefix: undefined });
const emit = defineEmits<{ "update:modelValue": [key: string] }>();
const list = ref<HTMLElement | null>(null);

function move(from: string, delta: number | "first" | "last") {
  const enabled = props.items.filter((t) => !t.disabled);
  const i = enabled.findIndex((t) => t.key === from);
  const next =
    delta === "first" ? enabled[0] : delta === "last" ? enabled.at(-1) : enabled.at((i + delta) % enabled.length);
  if (!next) return;
  emit("update:modelValue", next.key);
  void nextTick(() => list.value?.querySelector<HTMLElement>(`[data-key="${next.key}"]`)?.focus());
}
function onKeydown(e: KeyboardEvent, key: string) {
  const map: Record<string, number | "first" | "last"> = { ArrowRight: 1, ArrowLeft: -1, Home: "first", End: "last" };
  const d = map[e.key];
  if (d === undefined) return;
  e.preventDefault();
  move(key, d);
}
</script>

<template>
  <div ref="list" data-ar="tabs" data-part="root" :data-variant="variant" role="tablist" :aria-label="label">
    <button
      v-for="t in items"
      :id="idPrefix ? `${idPrefix}-${t.key}` : undefined"
      :key="t.key"
      type="button"
      role="tab"
      data-part="tab"
      :data-key="t.key"
      :data-state="[t.key === modelValue && 'selected', t.disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
      :aria-selected="t.key === modelValue"
      :tabindex="t.key === modelValue ? 0 : -1"
      :disabled="t.disabled"
      @click="emit('update:modelValue', t.key)"
      @keydown="onKeydown($event, t.key)"
    >
      <ArIcon v-if="t.icon" :name="t.icon" data-part="icon" size="sm" />
      <span data-part="label">{{ t.label }}</span>
      <span v-if="t.count !== undefined" data-part="count">{{ t.count }}</span>
    </button>
  </div>
</template>
