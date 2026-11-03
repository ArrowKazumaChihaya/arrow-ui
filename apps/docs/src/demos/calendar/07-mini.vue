<!-- 小さなカレンダー（size="mini"） | 設定のシフトテンプレートの「カレンダーで確かめる」。見出しはカレンダーの絵と title・extra slot、マスは日付・当たった条件の札（events の label・color・background）・時間帯（note）、下に footer slot の凡例。祝日は cellMarks の holiday で赤。 -->
<script setup lang="ts">
import { ArCalendar, ArTag, type ArCalendarEvent } from "@arrow/ui";
const HOL: Record<number, string> = { 3: "文化の日", 23: "勤労感謝の日" };
const PAL = [
  { background: "var(--ar-accent-muted)", color: "var(--ar-accent-ink)" },
  { background: "#F1EBFA", color: "#6A4BA3" },
  { background: "var(--ar-color-warn-subtle)", color: "var(--ar-color-warn)" },
];
const conds = ["毎月第4金曜日", "祝日", "曜日"];
const events: ArCalendarEvent[] = Array.from({ length: 30 }, (_, i) => {
  const d = i + 1;
  const wd = new Date(2026, 10, d).getDay();
  const c = d === 27 ? 0 : HOL[d] ? 1 : 2;
  const note = c === 0 ? "9:00-22:00" : c === 1 ? "10:00-19:00" : wd === 0 ? "休み" : wd === 6 ? "10:00-15:00" : "9:00-18:00";
  return { date: `2026-11-${String(d).padStart(2, "0")}`, label: "①②③"[c]!, note, title: `11月${d}日：${conds[c]}（${note}）${HOL[d] ? "・" + HOL[d] : ""}`, ...PAL[c] };
});
</script>

<template>
<ArCalendar
  size="mini"
  month="2026-11"
  today="2026-11-04"
  title="カレンダーで確かめる：2026年11月"
  :events="events"
  :show-adjacent="false"
  weekend-colors
  :cell-marks="(d) => (HOL[Number(d.slice(8))] && d.startsWith('2026-11') ? { holiday: true } : undefined)"
  label="シフトテンプレートの当たり方"
  style="max-width: 1032px"
>
  <template #extra><ArTag size="xs" tone="accent">このテンプレートを使うと</ArTag><span>数字は当たった条件（優先順位）</span></template>
  <template #footer>
    <span v-for="(c, i) in conds" :key="c" style="display: inline-flex; align-items: center; gap: 5px"><i :style="{ ...PAL[i], fontStyle: 'normal', padding: '0 5px', borderRadius: '5px', fontWeight: 700, fontSize: '10.5px', lineHeight: '17px' }">{{ "①②③"[i] }}</i>{{ c }}</span>
  </template>
</ArCalendar>
</template>
