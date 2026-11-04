<!-- 今日の勤怠の印・押せる見出しと札 | 名前の前の丸：緑の点＝勤務中、白抜き＝まだ打刻がない（データは製品が渡す。キャンバスの LiveAndSettings）。clickable で日付の見出しと札を押せる（day-click で日の詳細を開くなど）。合計は製品の summarizeShiftViewDays の値をそのまま totals に渡せる。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArShiftViewTable } from "@s_and_a/arrow-ui";
import type { ArShiftViewRow } from "@s_and_a/arrow-ui";
import { branches, people, shifts, today, weekDates } from "./_data";

const live: Record<number, ArShiftViewRow["live"]> = { 101: "absent", 102: "working", 103: "working", 104: "working", 105: "absent" };
const rows = people.map((p) => ({ ...p, live: live[p.key as number] }));
const last = ref("（まだ押していません）");
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 10px">
    <ArShiftViewTable
      :dates="weekDates"
      :rows="rows"
      :shifts="shifts"
      :branches="branches"
      :own-branch-ids="[1]"
      :today="today"
      :zoom="false"
      :search="false"
      clickable
      :totals="{ '2026-10-20': { workers: 4, minutes: 1860 } }"
      @day-click="last = `日付 ${$event}`"
      @shift-click="(s, r) => (last = `${r.name}さんの ${s.date} のシフト（id ${s.id}）`)"
    />
    <small>押したもの：{{ last }}</small>
  </div>
</template>
