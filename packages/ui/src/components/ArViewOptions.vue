<script setup lang="ts">
/**
 * ArViewOptions 1.0 — 表示内容の選択。押すと、見出しごとのチェックの並び（名前・1行の説明・見え方の見本）が開く。
 * ボタンには選んでいる数（6/7）。下に「すべて表示」「閉じる」。項目は menuitemcheckbox で、↑↓ で移り Space / Enter で切り替える。
 * Escape・外を押すと閉じ、ボタンにフォーカスを戻す。
 */
import { computed, nextTick, ref, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import ArFloat from "../internal/ArFloat.vue";
import { useId } from "../provider/context";
import type { ArViewOption, ArViewOptionsProps } from "./ArViewOptions.contract";

const props = withDefaults(defineProps<ArViewOptionsProps>(), {
  label: "表示内容",
  title: undefined,
  open: undefined,
  placement: "bottom-start",
  width: 300,
  disabled: false,
  labels: () => ({ all: "すべて表示", close: "閉じる" }),
});
const emit = defineEmits<{ "update:modelValue": [keys: string[]]; "update:open": [open: boolean] }>();

const id = useId("ar-view-options");
const trigger = ref<HTMLButtonElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const inner = ref(false);
const isOpen = computed(() => props.open ?? inner.value);
watch(
  () => props.open,
  (v) => v !== undefined && (inner.value = v),
);
const all = computed<ArViewOption[]>(() => props.groups.flatMap((g) => [...g.options]));
const chosen = computed(() => new Set(props.modelValue));
const onCount = computed(() => all.value.filter((o) => chosen.value.has(o.key)).length);

function setOpen(v: boolean) {
  if (props.disabled && v) return;
  inner.value = v;
  emit("update:open", v);
}
function items(): HTMLElement[] {
  return [...(panel.value?.querySelectorAll<HTMLElement>('[role="menuitemcheckbox"]:not(:disabled)') ?? [])];
}
async function openAt(at: "first" | "last") {
  setOpen(true);
  await nextTick();
  await nextTick();
  const list = items();
  (at === "first" ? list[0] : list.at(-1))?.focus();
}
function close(refocus: boolean) {
  setOpen(false);
  if (refocus) void nextTick(() => trigger.value?.focus());
}
function toggle(o: ArViewOption) {
  if (o.disabled) return;
  const next = chosen.value.has(o.key) ? props.modelValue.filter((k) => k !== o.key) : [...props.modelValue, o.key];
  emit("update:modelValue", all.value.map((x) => x.key).filter((k) => next.includes(k)));
}
function showAll() {
  emit("update:modelValue", all.value.filter((o) => !o.disabled || chosen.value.has(o.key)).map((o) => o.key));
}
function onTriggerKey(e: KeyboardEvent) {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    void openAt(e.key === "ArrowDown" ? "first" : "last");
  }
}
function onPanelKey(e: KeyboardEvent) {
  const list = [...(panel.value?.querySelectorAll<HTMLElement>("button:not(:disabled)") ?? [])];
  const i = list.indexOf(document.activeElement as HTMLElement);
  const moves: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };
  if (e.key in moves) {
    e.preventDefault();
    list[(i + moves[e.key]! + list.length) % list.length]?.focus();
  } else if (e.key === "Home" || e.key === "End") {
    e.preventDefault();
    (e.key === "Home" ? list[0] : list.at(-1))?.focus();
  } else if (e.key === "Tab") {
    close(false);
  }
}
</script>

<template>
  <span data-ar="view-options" data-part="root" :data-state="[isOpen && 'open', disabled && 'disabled'].filter(Boolean).join(' ') || undefined">
    <button
      ref="trigger"
      type="button"
      data-part="trigger"
      aria-haspopup="menu"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="isOpen ? id : undefined"
      :disabled="disabled"
      @click="isOpen ? close(false) : setOpen(true)"
      @keydown="onTriggerKey"
    >
      <ArIcon line name="filter" data-part="icon" />
      <span data-part="label">{{ label }}</span>
      <span data-part="count">{{ onCount }}/{{ all.length }}</span>
      <ArIcon line name="cd" data-part="caret" />
    </button>
    <ArFloat :id="id" :open="isOpen" :anchor="trigger" ar="view-options-panel" role="menu" :label="title ?? label" :placement="placement" :offset="6" @close="(r) => close(r === 'escape')">
      <div ref="panel" data-part="panel" :style="{ width: `${width}px` }" @keydown="onPanelKey">
        <div v-if="title" data-part="title">{{ title }}</div>
        <div v-for="(g, gi) in groups" :key="gi" data-part="group" role="group" :aria-label="g.label">
          <div v-if="g.label" data-part="group-title" aria-hidden="true">{{ g.label }}</div>
          <button
            v-for="o in g.options"
            :key="o.key"
            type="button"
            role="menuitemcheckbox"
            data-part="option"
            :data-state="[chosen.has(o.key) && 'checked', o.disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
            :aria-checked="chosen.has(o.key) ? 'true' : 'false'"
            :disabled="o.disabled"
            tabindex="-1"
            @click="toggle(o)"
          >
            <span data-part="box" aria-hidden="true"><ArIcon line name="check" /></span>
            <span data-part="text">
              <b>{{ o.label }}</b>
              <small v-if="o.description" data-part="description">{{ o.description }}</small>
            </span>
            <span
              v-if="o.sample"
              data-part="sample"
              aria-hidden="true"
              :style="{ background: o.sample.background, color: o.sample.color, boxShadow: o.sample.ring }"
            ><ArIcon v-if="o.sample.icon" :name="o.sample.icon" />{{ o.sample.text }}</span>
          </button>
        </div>
        <div data-part="foot">
          <button type="button" tabindex="-1" @click="showAll">{{ labels.all }}</button>
          <button type="button" tabindex="-1" @click="close(true)">{{ labels.close }}</button>
        </div>
      </div>
    </ArFloat>
  </span>
</template>
