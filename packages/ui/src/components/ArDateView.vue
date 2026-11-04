<script setup lang="ts">
/**
 * ArDateView 1.1 — 日付を「11月05日(木)」の形で見せる。曜日の色は日曜・祝日が赤、土曜が青。
 * 幅の狭い画面では「11/05(木)」（format="auto"）。
 */
import { computed } from "vue";
import type { ArDateViewProps } from "./ArDateView.contract";

const props = withDefaults(defineProps<ArDateViewProps>(), { holiday: false, format: "auto", labels: () => ({}), shortWeekday: true });
const WEEK = ["日", "月", "火", "水", "木", "金", "土"] as const;
const L = computed(() => ({ long: "{month}月{day}日", short: "{month}/{day}", weekdays: WEEK, ...props.labels }));

/** "2026-11-05" は時差でずれないよう、その日の日付として読む。 */
const day = computed(() => {
  if (props.date instanceof Date) return { y: props.date.getFullYear(), m: props.date.getMonth() + 1, d: props.date.getDate() };
  const [y, m, d] = String(props.date).slice(0, 10).split("-").map(Number);
  return { y: y!, m: m!, d: d! };
});
const weekday = computed(() => new Date(day.value.y, day.value.m - 1, day.value.d).getDay());
const tone = computed(() => (props.holiday || weekday.value === 0 ? "sun" : weekday.value === 6 ? "sat" : undefined));
const pad = (n: number) => String(n).padStart(2, "0");
const iso = computed(() => `${day.value.y}-${pad(day.value.m)}-${pad(day.value.d)}`);
const label = (text: string) => text.replaceAll("{year}", String(day.value.y)).replaceAll("{month}", pad(day.value.m)).replaceAll("{day}", pad(day.value.d));
const long = computed(() => label(L.value.long));
const short = computed(() => label(L.value.short));
</script>

<template>
  <time data-ar="date-view" data-part="root" :data-format="format" :datetime="iso">
    <span v-if="format !== 'short'" data-part="long"
      >{{ long }}<span data-part="weekday" :data-tone="tone">({{ L.weekdays[weekday] }})</span></span
    ><span v-if="format !== 'long'" data-part="short"
      >{{ short }}<span v-if="shortWeekday" data-part="weekday" :data-tone="tone">({{ L.weekdays[weekday] }})</span></span
    >
  </time>
</template>
