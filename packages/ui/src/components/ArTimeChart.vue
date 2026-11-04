<script setup lang="ts">
/**
 * ArTimeChart 1.0 — 時間の横棒のチャート。month は1日＝1行の1か月（勤怠の種類ごとの色の帯・上の線がシフト・下の線が深夜）、day は1日の内容ごとの行。
 * 帯に乗せると「種類・時間帯・時間数」の吹き出し。month の日付は押せる（select。その日の大きなチャートを開く）。
 * キーボード：month の日付は Tab で移って Enter。行の読み上げに帯の中身（種類・時間帯）を含める。
 */
import { computed } from "vue";
import ArTooltip from "./ArTooltip.vue";
import { useDesignForm } from "../provider/context";
import type { ArTimeChartBar, ArTimeChartKind, ArTimeChartLabels, ArTimeChartProps, ArTimeChartRow } from "./ArTimeChart.contract";

const props = withDefaults(defineProps<ArTimeChartProps>(), {
  mode: "month",
  range: undefined,
  tickStep: undefined,
  headLabel: undefined,
  legend: false,
  hint: undefined,
  minBarWidth: 0.4,
  label: undefined,
  labels: () => ({}),
});
const emit = defineEmits<{ select: [row: ArTimeChartRow] }>();

const KIND: Record<ArTimeChartKind, string> = {
  shift: "シフト",
  work: "通常勤務",
  preover: "法定内残業",
  overtime: "法定外残業",
  weekOver: "週の法定外残業",
  monthOver: "月の法定外残業",
  sixtyOver: "60時間超の残業",
  outhol: "法定外休日",
  lawhol: "法定休日",
  night: "深夜勤務",
  break: "休憩",
  missing: "退勤がされていません",
};
const L = computed<ArTimeChartLabels>(() => {
  const l = props.labels;
  return {
    shiftLine: "（上の線）",
    nightLine: "（下の線）",
    range: "時間帯 : {s}〜{e}",
    duration: "時間数 : {h}時間{m}分",
    weekdays: ["日", "月", "火", "水", "木", "金", "土"],
    nextDay: "翌{h}",
    open: "{label}のチャートを大きく見る",
    ...l,
    kinds: { ...KIND, ...(l.kinds ?? {}) },
  };
});
const kindName = (k: ArTimeChartKind) => L.value.kinds[k] ?? KIND[k];
const tickForm = useDesignForm<"180" | "60">("ArTimeChart", "tick", "180");

const range = computed<[number, number]>(() => {
  if (props.range) return [props.range[0], props.range[1]];
  if (props.mode === "month") return [-60, 1680];
  const all = props.rows.flatMap((r) => r.bars);
  if (!all.length) return [480, 1260];
  const lo = Math.floor(Math.min(...all.map((b) => b.start)) / 60) * 60 - 120;
  const hi = Math.ceil(Math.max(...all.map((b) => b.end)) / 60) * 60 + 120;
  return [lo, hi];
});
const step = computed(() => props.tickStep ?? (props.mode === "day" ? 60 : Number(tickForm.value)));
const span = computed(() => range.value[1] - range.value[0]);
const pct = (m: number) => ((Math.max(range.value[0], Math.min(range.value[1], m)) - range.value[0]) / span.value) * 100;
const hourText = (m: number) => {
  const h = Math.floor(m / 60);
  return h >= 24 ? L.value.nextDay.replace("{h}", String(h - 24)) : h < 0 ? String(h + 24) : String(h);
};
const ticks = computed(() => {
  const out: { m: number; left: number; text: string }[] = [];
  const first = Math.ceil(range.value[0] / step.value) * step.value;
  for (let m = first; m <= range.value[1]; m += step.value) out.push({ m, left: pct(m), text: hourText(m) });
  return out;
});
const clock = (m: number) => {
  const h = Math.floor(m / 60);
  return `${h}:${String(((m % 60) + 60) % 60).padStart(2, "0")}`;
};
const lane = (k: ArTimeChartKind) =>
  props.mode === "day" ? "main" : k === "shift" ? "shift" : k === "night" ? "night" : ["preover", "overtime", "weekOver", "monthOver", "sixtyOver"].includes(k) ? "over" : "main";
const tipOf = (b: ArTimeChartBar) => {
  if (b.tip) return b.tip;
  const lines = [b.name ?? kindName(b.kind)];
  if (b.kind === "missing") return lines.join("\n");
  lines.push(L.value.range.replace("{s}", clock(b.start)).replace("{e}", clock(b.end)));
  if (b.kind !== "break" && b.kind !== "shift") {
    const mins = b.minutes ?? b.end - b.start;
    lines.push(L.value.duration.replace("{h}", String(Math.floor(mins / 60))).replace("{m}", String(mins % 60).padStart(2, "0")));
  }
  return lines.join("\n");
};
const barStyle = (b: ArTimeChartBar) => ({
  left: `${pct(b.start)}%`,
  width: `${Math.max(props.minBarWidth, pct(b.end) - pct(b.start))}%`,
});
const wdText = (r: ArTimeChartRow) => r.weekdayLabel ?? (r.weekday != null ? L.value.weekdays[r.weekday] : undefined);
const wdTone = (r: ArTimeChartRow) => (r.weekday === 0 ? "sun" : r.weekday === 6 ? "sat" : undefined);
const rowAria = (r: ArTimeChartRow) =>
  [r.label + (wdText(r) ? `(${wdText(r)})` : ""), r.sub, ...r.bars.map((b) => tipOf(b).replace(/\n/g, " ")), r.bars.length ? "" : r.note]
    .filter(Boolean)
    .join("、");

const legendKinds = computed<ArTimeChartKind[]>(() => {
  if (!props.legend) return [];
  if (Array.isArray(props.legend)) return [...props.legend];
  const order: ArTimeChartKind[] = ["work", "preover", "overtime", "weekOver", "monthOver", "sixtyOver", "outhol", "lawhol", "night", "shift", "break", "missing"];
  const seen = new Set(props.rows.flatMap((r) => r.bars.map((b) => b.kind)));
  return order.filter((k) => seen.has(k));
});
const legendText = (k: ArTimeChartKind) =>
  kindName(k) + (props.mode === "month" ? (k === "shift" ? L.value.shiftLine : k === "night" ? L.value.nightLine : "") : "");
const head = computed(() => props.headLabel ?? (props.mode === "month" ? "日付・形態" : "内容"));
</script>

<template>
  <div data-ar="time-chart" data-part="root" :data-mode="mode" role="group" :aria-label="label">
    <div v-if="legendKinds.length || hint" data-part="legend">
      <span v-for="k in legendKinds" :key="k" data-part="legend-item"><i data-part="swatch" :data-kind="k" :data-lane="lane(k)" aria-hidden="true" />{{ legendText(k) }}</span>
      <span v-if="hint" data-part="hint"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>{{ hint }}</span>
    </div>
    <div data-part="grid" role="table" :aria-label="label" :style="{ '--ar-chart-tick-width': `${Math.max(0, ticks.length - 1) * 32}px` }">
      <div data-part="head" role="row">
        <div data-part="head-label" role="columnheader">{{ head }}</div>
        <div data-part="ticks" role="columnheader" aria-hidden="true">
          <span v-for="t in ticks" :key="t.m" data-part="tick" :style="{ left: `${t.left}%` }">{{ t.text }}</span>
        </div>
      </div>
      <div v-for="r in rows" :key="r.key" data-part="row" role="row" :data-tone="r.tone">
        <button
          v-if="mode === 'month'"
          type="button"
          data-part="row-label"
          role="rowheader"
          :aria-label="`${L.open.replace('{label}', r.label)}：${rowAria(r)}`"
          @click="emit('select', r)"
        >
          <b data-part="date">{{ r.label }}<em v-if="wdText(r)" data-part="weekday" :data-weekday="wdTone(r)">({{ wdText(r) }})</em></b>
          <small v-if="r.sub" data-part="sub">{{ r.sub }}</small>
        </button>
        <div v-else data-part="row-label" role="rowheader">
          <b data-part="date">{{ r.label }}</b>
          <small v-if="r.sub" data-part="sub">{{ r.sub }}</small>
        </div>
        <div data-part="lane" role="cell" :aria-label="rowAria(r)">
          <span v-for="t in ticks" :key="t.m" data-part="gridline" aria-hidden="true" :style="{ left: `${t.left}%` }" />
          <ArTooltip v-for="(b, i) in r.bars" :key="i" :data-lane="lane(b.kind)" :style="barStyle(b)" placement="top">
            <span data-part="bar" :data-kind="b.kind" tabindex="0" :aria-label="tipOf(b)"><span v-if="mode === 'day' && (b.text ?? '') !== ''" data-part="bar-text">{{ b.text }}</span></span>
            <template #content><span data-part="tip">{{ tipOf(b) }}</span></template>
          </ArTooltip>
          <span v-if="!r.bars.length && r.note" data-part="note">{{ r.note }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
