<!-- 決まりと「適用」（シフト一括登録・募集の決まり） | default のスロットに曜日ごとの決まり（ArWeekdayPicker・ArSelect・ArTimeInput など）を置き、applyText を渡すと「適用」を出す（押すと apply に今の期間）。remix は右下の主ボタン（PopBulk の「日付に当てはめる」）、classic は箱の下の幅250の大きな「適用」と下向きの矢印の絵（/img/apply.png）。 -->
<script setup lang="ts">
import { ArButton, ArPeriodBox, ArSelect, ArTimeInput, ArWeekdayPicker, type ArPeriodBoxValue, type ArTimeValue, type ArWeekday } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const period = ref<ArPeriodBoxValue>({ mode: "half", start: "2026-11-16", end: "2026-11-30" });
const rules = ref<{ days: ArWeekday[]; pattern: number | null; start: ArTimeValue; end: ArTimeValue }[]>([
  { days: [1, 2, 3, 4, 5], pattern: 1, start: { time: "10:00", day: "same" }, end: { time: "19:00", day: "same" } },
  { days: [0, 6, "holiday"], pattern: 2, start: { time: "09:00", day: "same" }, end: { time: "20:00", day: "same" } },
]);
const patterns = [
  { value: 1, label: "通常勤務1", description: "10:00–19:00" },
  { value: 2, label: "土日フル", description: "09:00–20:00" },
];
const applied = ref("");
</script>

<template>
  <div style="max-width: 860px">
    <ArPeriodBox v-model="period" label="一括登録する期間" apply-text="適用" :modes="['month', 'half']" @apply="(v) => (applied = `${v.start}〜${v.end} に当てはめた`)">
      <div style="display: grid; gap: 8px">
        <div v-for="(r, i) in rules" :key="i" style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px">
          <ArWeekdayPicker v-model="r.days" :label="`決まり${i + 1}の曜日`" />
          <ArSelect v-model="r.pattern" :options="patterns" size="sm" :label="`決まり${i + 1}のパターン`" style="width: 200px" />
          <ArTimeInput v-model="r.start" size="sm" :label="`決まり${i + 1}の開始`" />
          <span>〜</span>
          <ArTimeInput v-model="r.end" size="sm" :label="`決まり${i + 1}の終了`" />
        </div>
      </div>
      <template #actions><ArButton tone="secondary" icon="plus" @click="rules.push({ days: [], pattern: null, start: { time: null, day: 'same' }, end: { time: null, day: 'same' } })">決まりを追加</ArButton></template>
    </ArPeriodBox>
    <p style="margin: 12px 0 0; font-size: 12px">{{ applied || "「適用」を押すと、製品が期間の日付に決まりを当てはめる" }}</p>
  </div>
</template>
