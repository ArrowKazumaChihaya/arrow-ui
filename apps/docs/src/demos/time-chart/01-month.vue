<!-- 1か月のチャート（勤怠詳細・マイページ） | 1日＝1行。帯は勤怠の種類ごとの色、上の細い線がシフト、下の細い線が深夜、休憩は斜線、打刻もれは赤い斜線。帯に乗せると種類・時間帯・時間数。日付を押すと select（その日の大きなチャート）。 -->
<script setup lang="ts">
import { ArTimeChart, type ArTimeChartBar, type ArTimeChartRow } from "@s_and_a/arrow-ui";
import { ref } from "vue";

const H = (h: number, m = 0) => h * 60 + m;
const rows: ArTimeChartRow[] = Array.from({ length: 14 }, (_, i) => {
  const d = i + 1;
  const wd = (4 + i) % 7; // 2026/10/01 は木曜
  const key = `10/${String(d).padStart(2, "0")}`;
  const weekend = wd === 0 || wd === 6;
  let bars: ArTimeChartBar[] = [];
  let sub = "通常";
  let note: string | undefined = weekend ? undefined : "勤務なし";
  let tone: ArTimeChartRow["tone"] = weekend ? "holiday" : undefined;
  if (wd === 6) sub = "法定外休日";
  if (wd === 0) sub = "法定休日";
  if (!weekend) {
    const morning = d % 4 === 1;
    const s = morning ? H(9) : H(13);
    const e = morning ? H(18) : H(22);
    bars = [
      { kind: "shift", start: s, end: e },
      { kind: "work", start: s, end: e, minutes: e - s - 60 },
      { kind: "break", start: s + 240, end: s + 300 },
    ];
  }
  if (d === 9) bars = [{ kind: "shift", start: H(13), end: H(22) }, { kind: "missing", start: H(13), end: H(13, 30) }];
  if (d === 10) {
    sub = "法定外休日";
    bars = [{ kind: "outhol", start: H(10), end: H(15) }];
  }
  if (d === 12) {
    bars = [{ kind: "shift", start: H(18), end: H(27) }, { kind: "work", start: H(18), end: H(26) }, { kind: "overtime", start: H(26), end: H(27) }, { kind: "break", start: H(22), end: H(23) }, { kind: "night", start: H(22), end: H(27) }];
  }
  if (d === 13) {
    sub = "有給";
    bars = [];
    note = "有給全日";
    tone = "paid";
  }
  if (d === 9) tone = "error";
  return { key, label: key, weekday: wd, sub, note, tone, bars };
});
const picked = ref("");
</script>

<template>
<div style="display: flex; flex-direction: column; gap: 8px">
  <ArTimeChart :rows="rows" legend hint="帯に乗せると時間帯と時間数が出ます。日付を押すとその日の大きなチャート" label="10月の勤怠チャート" @select="(r) => (picked = r.label)" />
  <div style="font-size: 13px">押した日：{{ picked || "（まだ）" }}</div>
</div>
</template>
