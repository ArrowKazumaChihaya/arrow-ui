<script setup lang="ts">
/**
 * 時刻のパネルの中身（ArTimePicker の中だけで使う）。根を持たない（部位を入れ物の直下に並べる）。
 * 時・分の列と「今」「決める」。↑↓で動かす、←→で列を移る、Enter で決める。
 */
import { nextTick, ref } from "vue";
import ArButton from "../components/ArButton.vue";

defineOptions({ inheritAttrs: false });
const props = defineProps<{
  h: number;
  m: number;
  hours: readonly number[];
  minutes: readonly number[];
  showFooter: boolean;
  baseId: string;
  labels: { hour: string; minute: string; now: string; ok: string };
}>();
const emit = defineEmits<{ "update:h": [h: number]; "update:m": [m: number]; now: []; ok: [] }>();
const cols = ref<HTMLElement | null>(null);
const pad = (n: number) => String(n).padStart(2, "0");

function scrollOn() {
  for (const el of cols.value?.querySelectorAll<HTMLElement>('[data-state~="selected"]') ?? []) {
    const col = el.parentElement!;
    col.scrollTop = el.offsetTop - col.clientHeight / 2 + el.offsetHeight / 2;
  }
}
function focusFirst() {
  scrollOn();
  cols.value?.querySelector<HTMLElement>('[data-part="col"]')?.focus();
}
function onKey(which: "h" | "m", e: KeyboardEvent) {
  const list = which === "h" ? props.hours : props.minutes;
  let i = Math.max(0, list.indexOf(which === "h" ? props.h : props.m));
  if (e.key === "ArrowDown") i = Math.min(list.length - 1, i + 1);
  else if (e.key === "ArrowUp") i = Math.max(0, i - 1);
  else if (e.key === "Home") i = 0;
  else if (e.key === "End") i = list.length - 1;
  else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    cols.value?.querySelectorAll<HTMLElement>('[data-part="col"]')[e.key === "ArrowRight" ? 1 : 0]?.focus();
    return;
  } else if (e.key === "Enter") {
    e.preventDefault();
    emit("ok");
    return;
  } else return;
  e.preventDefault();
  if (which === "h") emit("update:h", list[i]!);
  else emit("update:m", list[i]!);
  nextTick(scrollOn);
}
function click(which: "h" | "m", v: number) {
  if (which === "h") emit("update:h", v);
  else emit("update:m", v);
  nextTick(scrollOn);
}
defineExpose({ scrollOn, focusFirst });
</script>

<template>
  <div ref="cols" data-part="cols">
    <div
      v-for="col in (['h', 'm'] as const)"
      :key="col"
      data-part="col"
      role="listbox"
      tabindex="0"
      :data-col="col"
      :aria-label="col === 'h' ? labels.hour : labels.minute"
      :aria-activedescendant="`${baseId}-${col}${col === 'h' ? h : m}`"
      @keydown="onKey(col, $event)"
    >
      <span
        v-for="v in col === 'h' ? hours : minutes"
        :id="`${baseId}-${col}${v}`"
        :key="v"
        data-part="cell"
        role="option"
        :aria-selected="v === (col === 'h' ? h : m)"
        :data-state="v === (col === 'h' ? h : m) ? 'selected' : undefined"
        @click="click(col, v)"
        >{{ pad(v) }}</span
      >
    </div>
  </div>
  <div v-if="showFooter" data-part="foot">
    <ArButton tone="ghost" size="sm" @click="emit('now')">{{ labels.now }}</ArButton>
    <ArButton tone="primary" size="sm" @click="emit('ok')">{{ labels.ok }}</ArButton>
  </div>
</template>
