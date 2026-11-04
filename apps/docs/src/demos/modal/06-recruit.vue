<!-- 多段のウィザード（シフト募集の4ページ） | steps（期間と人数 → 日ごとの確認 → 相手 → 確認して送る）・v-model:current-step・#toolbar の切り替え・back-text の「戻る」・footer-note（主なボタンの左）・ok-text の「次へ」でフッターに手順の操作を置く（ArModal だけで足りる）。1ページ目は ArPeriodBox（期間）と、ArTable の入力の行（曜日は ArWeekdayPicker の sm をスロットで、パターンは editor="select"、時刻は editor="time"、人数は ArStepper）。2ページ目は lines（段に分ける列）で日ごとに複数の時間帯を段で並べる（PopRecruitDays）。 -->
<script setup lang="ts">
import {
  ArButton,
  ArField,
  ArModal,
  ArPeriodBox,
  ArSegmented,
  ArStepper,
  ArTable,
  ArWeekdayPicker,
  type ArPeriodBoxValue,
  type ArTableColumn,
  type ArTableEditValue,
  type ArWeekday,
} from "@s_and_a/arrow-ui";
import { computed, ref } from "vue";

const open = ref(true);
const step = ref(0);
const tab = ref("new");
const steps = ["期間と人数", "日ごとの確認", "相手", "確認して送る"];
const period = ref<ArPeriodBoxValue>({ mode: "month", start: "2026-11-01", end: "2026-11-30" });

/* 1ページ目：曜日とパターンで決める時間と人数 */
type Rule = { id: number; days: ArWeekday[]; pattern: number; start: string; end: string; count: number };
const patterns = [
  { value: 1, label: "通常勤務1", description: "10:00–19:00", dot: "#2F6BDA" },
  { value: 2, label: "土日フル", description: "09:00–20:00", dot: "#2F6BDA" },
  { value: 3, label: "ディナー", description: "17:00–22:00", dot: "#D2457E" },
];
const rules = ref<Rule[]>([
  { id: 1, days: [1, 2, 3, 4, 5], pattern: 1, start: "10:00", end: "19:00", count: 2 },
  { id: 2, days: [0, 6, "holiday"], pattern: 2, start: "09:00", end: "20:00", count: 3 },
  { id: 3, days: [0, 1, 2, 3, 4, 5, 6], pattern: 3, start: "17:00", end: "22:00", count: 1 },
]);
const ruleEdits = ref<Record<string, ArTableEditValue>>({});
const ruleColumns: ArTableColumn<Rule>[] = [
  { key: "days", title: "曜日", width: 170 },
  { key: "pattern", title: "募集パターン", edit: true, editor: "select", options: patterns, placeholder: "パターンを選ぶ" },
  { key: "start", title: "募集時間", width: 74, edit: true, editor: "time" },
  { key: "end", title: "", width: 96, edit: true, editor: "time", lead: "〜" },
  { key: "count", title: "人数", width: 110 },
];

/* 2ページ目：日ごとの確認（1日に複数の時間帯を段で） */
type Day = { id: string; date: string; tone?: "sun" | "sat"; note?: string; fixed?: boolean; pattern: string[]; colors: string[]; start: string[]; end: string[]; count: number[] };
const days: Day[] = [
  { id: "11-01", date: "11/1（日）", tone: "sun", pattern: ["土日フル", "ディナー"], colors: ["#2F6BDA", "#D2457E"], start: ["09:00", "17:00"], end: ["20:00", "22:00"], count: [3, 1] },
  { id: "11-02", date: "11/2（月）", pattern: ["通常勤務1", "ディナー"], colors: ["#2F6BDA", "#D2457E"], start: ["10:00", "17:00"], end: ["19:00", "22:00"], count: [2, 1] },
  { id: "11-03", date: "11/3（火・祝）", tone: "sun", note: "文化の日", fixed: true, pattern: ["土日フル", "ディナー"], colors: ["#2F6BDA", "#D2457E"], start: ["09:00", "17:00"], end: ["20:00", "22:00"], count: [4, 2] },
  { id: "11-04", date: "11/4（水）", pattern: ["通常勤務1"], colors: ["#2F6BDA"], start: ["10:00"], end: ["19:00"], count: [2] },
];
const dayEdits = ref<Record<string, ArTableEditValue>>({});
const dayColumns: ArTableColumn<Day>[] = [
  { key: "date", title: "日付", width: 128 },
  { key: "pattern", title: "パターン", width: 160, lines: true },
  { key: "start", title: "募集時間", width: 74, lines: true, edit: true, editor: "time" },
  { key: "end", title: "", width: 96, lines: true, edit: true, editor: "time", lead: "〜" },
  { key: "count", title: "人数", width: 140, lines: true },
];
const counts = ref<Record<string, number>>({});
const countOf = (d: Day, j: number) => counts.value[`${d.id}:${j}`] ?? d.count[j] ?? 1;

const note = computed(() => (step.value === 0 ? "「次へ」で1日ごとの時間と人数を確認します" : undefined));
</script>

<template>
  <div style="position: relative; height: 760px; background: #E4E9EF; overflow: hidden; border-radius: 8px">
    <ArModal
      v-model:open="open"
      contained
      size="xl"
      :width="900"
      title="シフト募集"
      description="日ごとに必要な時間と人数を決めて、従業員にシフトを提出してもらいます。"
      :steps="steps"
      v-model:current-step="step"
      steps-clickable
      :back-text="step > 0 ? '戻る' : undefined"
      :footer-note="note"
      footer-note-align="end"
      :ok-text="step < 3 ? '次へ' : '送る'"
      cancel-text=""
      @back="step--"
      @ok="step < 3 ? step++ : (open = false)"
      @close="open = true"
    >
      <template #toolbar>
        <ArSegmented v-model="tab" label="募集" size="sm" :options="[{ value: 'new', label: '新しく募集' }, { value: 'ans', label: '提出状況', count: 2, countTone: 'warn' }]" />
      </template>
      <template v-if="step === 0">
        <ArField label="募集する期間" required>
          <ArPeriodBox v-model="period" label="募集する期間" hint="日付を変えると、合わなくなったときは「カスタム」に変わります" />
        </ArField>
        <ArField label="募集する時間と人数">
          <ArTable v-model:edits="ruleEdits" :columns="ruleColumns" :rows="rules" row-key="id" caption="募集する時間と人数" density="compact">
            <template #cell-days="{ row }"><ArWeekdayPicker v-model="row.days" size="xs" :label="`決まり${row.id}の曜日`" /></template>
            <template #cell-count="{ row }"><ArStepper v-model="row.count" :min="0" variant="split" size="sm" label="人数" /></template>
            <template #actions="{ row }"><ArButton tone="muted" size="sm" icon="x" :label="`決まり${row.id}を消す`" @click="rules = rules.filter((r) => r !== row)" /></template>
          </ArTable>
        </ArField>
      </template>
      <template v-else-if="step === 1">
        <ArTable v-model:edits="dayEdits" :columns="dayColumns" :rows="days" row-key="id" caption="日ごとの確認">
          <template #cell-date="{ row }">
            <b :style="{ color: row.tone === 'sun' ? 'var(--ar-color-sun)' : undefined }">{{ row.date }}</b>
            <small v-if="row.note" style="display: block; color: var(--ar-color-sun); font-size: 11px">{{ row.note }}</small>
          </template>
          <template #cell-pattern="{ row, value, line }">
            <span v-if="value" style="display: inline-flex; align-items: center; gap: 7px; font-weight: 700; font-size: 12.5px"
              ><i :style="{ width: '7px', height: '7px', borderRadius: '50%', background: row.colors[line ?? 0] }" />{{ value }}</span
            >
          </template>
          <template #cell-count="{ row, line }">
            <ArStepper :model-value="countOf(row, line ?? 0)" :min="0" variant="split" size="sm" unit="人" label="人数" @update:model-value="(v) => (counts[`${row.id}:${line}`] = v)" />
          </template>
          <template #actions="{ row }">
            <ArButton tone="link" size="sm" icon="plus">時間帯</ArButton>
            <ArButton tone="muted" size="sm">募集しない</ArButton>
            <ArButton v-if="row.fixed" tone="muted" size="sm" icon="undo">戻す</ArButton>
          </template>
        </ArTable>
      </template>
      <p v-else style="margin: 0">手順 {{ step + 1 }}：{{ steps[step] }}</p>
    </ArModal>
  </div>
</template>
