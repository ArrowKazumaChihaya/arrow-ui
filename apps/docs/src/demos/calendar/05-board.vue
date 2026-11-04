<!-- シフト画面のカレンダー（board） | variant="board"：角の丸いマス。日付は真ん中の丸（月の1日は「10/1」）、行事は登録した色の点と名前（events の color）、#cell はマスの下の段（ArTag size="xs" の「不足1」「提出2」と人数）。cellMarks でロック中（斜線と鍵）・非公開（目の印）・注意（赤い枠）。 -->
<script setup lang="ts">
import { ArCalendar, ArTag, type ArCalendarCellMarks, type ArCalendarEvent } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const day = ref<string | null>("2026-10-21");
const month = ref("2026-10");
const d = (n: number) => `2026-10-${String(n).padStart(2, "0")}`;
const events: ArCalendarEvent[] = [
  ...[2, 9, 16, 23, 30].map((n) => ({ date: d(n), label: "朝礼", color: "#2196F3" })),
  { date: d(13), label: "棚卸し", color: "#E58500" },
  { date: d(27), label: "店長会議", color: "#7146C3" },
];
const short: Record<number, number> = { 25: 1, 27: 2 };
const sub: Record<number, number> = { 20: 2, 21: 2, 25: 2 };
const marks = (date: string): ArCalendarCellMarks | undefined => {
  if (!date.startsWith("2026-10")) return undefined;
  const n = Number(date.slice(8));
  return { locked: n <= 8, unpublished: n >= 26, alert: !!short[n] };
};
</script>

<template>
<div style="max-width: 505px">
  <ArCalendar v-model="day" v-model:month="month" variant="board" :show-header="false" weekend-colors today="2026-10-20" :events="events" :cell-marks="marks" label="シフトのカレンダー">
    <template #cell="c">
      <ArTag v-if="short[c.day] && c.month === 10" tone="danger" size="xs">不足{{ short[c.day] }}</ArTag>
      <ArTag v-if="sub[c.day] && c.month === 10" tone="ok" size="xs">提出{{ sub[c.day] }}</ArTag>
      <span>{{ (c.day % 3) + 3 }}名</span>
    </template>
  </ArCalendar>
</div>
</template>
