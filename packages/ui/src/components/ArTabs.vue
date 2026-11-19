<script setup lang="ts">
/**
 * ArTabs 1.2 — タブ。中身の出し分けは使う側が modelValue で行う。
 * variant：band はカードの頭（帯）に置くタブ、line はカードの中の下線のタブ、card は閉じられる・足せるタブ。
 * ←→ で移り、Home / End で端へ。閉じられるタブは Delete で close。
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import ArBadge from "./ArBadge.vue";
import type { ArTabsProps } from "./ArTabs.contract";

const props = withDefaults(defineProps<ArTabsProps>(), {
  size: "md",
  variant: "line",
  idPrefix: undefined,
  addable: false,
  addLabel: "追加",
  alertLabel: "要確認",
});
const emit = defineEmits<{ "update:modelValue": [key: string]; close: [key: string]; add: [] }>();
const list = ref<HTMLElement | null>(null);
const root = ref<HTMLElement | null>(null);
/**
 * 1.2：横にあふれたとき（スマホのタブなど）、続きがある側の端を薄くして「横に動かせる」ことを見せる。
 * 選んだタブは見える所まで動かす。
 */
const overflow = ref<"start" | "end" | "both" | undefined>(undefined);
function measure() {
  const el = root.value;
  if (!el) return;
  const more = el.scrollWidth - el.clientWidth > 1;
  const atStart = el.scrollLeft <= 1;
  const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
  overflow.value = !more ? undefined : atStart ? "end" : atEnd ? "start" : "both";
}
function revealSelected(smooth: boolean) {
  const el = root.value;
  const tab = el?.querySelector<HTMLElement>('[data-part="tab"][aria-selected="true"]');
  if (!el || !tab || el.scrollWidth <= el.clientWidth) return;
  const left = tab.offsetLeft - el.offsetLeft;
  if (left < el.scrollLeft || left + tab.offsetWidth > el.scrollLeft + el.clientWidth)
    el.scrollTo({ left: Math.max(0, left - 24), behavior: smooth ? "smooth" : "auto" });
}
let sizes: ResizeObserver | null = null;
onMounted(() => {
  if (typeof ResizeObserver !== "undefined" && root.value) {
    sizes = new ResizeObserver(() => measure());
    sizes.observe(root.value);
    if (list.value) sizes.observe(list.value);
  }
  revealSelected(false);
  measure();
});
onBeforeUnmount(() => sizes?.disconnect());
watch(
  () => props.modelValue,
  () => void nextTick(() => {
    revealSelected(true);
    measure();
  }),
);

function focusKey(key: string) {
  void nextTick(() => list.value?.querySelector<HTMLElement>(`[data-key="${key.replace(/["\\]/g, "\\$&")}"]`)?.focus());
}
function move(from: string, delta: number | "first" | "last") {
  const enabled = props.items.filter((t) => !t.disabled);
  const i = enabled.findIndex((t) => t.key === from);
  const next =
    delta === "first" ? enabled[0] : delta === "last" ? enabled.at(-1) : enabled.at((i + delta) % enabled.length);
  if (!next) return;
  emit("update:modelValue", next.key);
  focusKey(next.key);
}
const closable = (key: string) => props.variant === "card" && !!props.items.find((t) => t.key === key)?.closable;
function onKeydown(e: KeyboardEvent, key: string) {
  if ((e.key === "Delete" || e.key === "Backspace") && closable(key)) {
    e.preventDefault();
    emit("close", key);
    return;
  }
  const map: Record<string, number | "first" | "last"> = { ArrowRight: 1, ArrowLeft: -1, Home: "first", End: "last" };
  const d = map[e.key];
  if (d === undefined) return;
  e.preventDefault();
  move(key, d);
}
</script>

<template>
  <div ref="root" data-ar="tabs" data-part="root" :data-variant="variant" :data-size="size === 'sm' ? 'sm' : undefined" :data-overflow="overflow" @scroll.passive="measure">
    <div ref="list" data-part="list" role="tablist" :aria-label="label">
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
        :aria-keyshortcuts="variant === 'card' && t.closable ? 'Delete' : undefined"
        :tabindex="t.key === modelValue ? 0 : -1"
        :disabled="t.disabled"
        @click="emit('update:modelValue', t.key)"
        @keydown="onKeydown($event, t.key)"
      >
        <ArIcon v-if="t.icon" :name="t.icon" data-part="icon" size="sm" />
        <span data-part="label">{{ t.label }}</span>
        <ArBadge v-if="t.count !== undefined" data-part="count" :count="t.count" tone="accent" variant="subtle" show-zero label="" />
        <span v-if="t.alert" data-part="alert" role="img" :aria-label="alertLabel"><ArIcon line name="alert" size="sm" /></span>
        <span
          v-if="variant === 'card' && t.closable"
          data-part="close"
          aria-hidden="true"
          :title="`${t.label}を閉じる`"
          @click.stop="!t.disabled && emit('close', t.key)"
        ><ArIcon line name="x" size="sm" /></span>
      </button>
    </div>
    <button v-if="variant === 'card' && addable" type="button" data-part="add" :aria-label="addLabel" :title="addLabel" @click="emit('add')">
      <ArIcon line name="plus" size="sm" />
    </button>
  </div>
</template>
