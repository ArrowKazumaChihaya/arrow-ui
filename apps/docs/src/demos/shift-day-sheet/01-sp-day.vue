<!-- スマホの日の詳細（RxSpDay） | スマホでカレンダーの日を押すと、下から日の詳細が出る。右上の ×、前の日・日付と曜日・次の日、要約の札（人件費・公開中）の下に、製品が「勤務メンバー」「表示内容」「勤務可能な人」を置く。見本は contained で 390px の枠の中に出している（製品では画面全体に出す）。 -->
<script setup lang="ts">
import { computed, ref } from "vue";
import { ArButton, ArField, ArSectionHead, ArSegmented, ArShiftDaySheet, ArTable, ArViewOptions } from "@arrow/ui";
import type { ArTableColumn, ArViewOptionGroup } from "@arrow/ui";

const open = ref(true);
const day = ref(21);
const published = ref(true);
const mode = ref("time");
const WD = ["日", "月", "火", "水", "木", "金", "土"];
const wd = computed(() => new Date(2026, 9, day.value).getDay());

type Member = { id: number; name: string; pattern: string; color: string; start: string[]; end: string[]; in: string };
const members: Member[] = [
  { id: 0, name: "千速 一真", pattern: "通常勤務2", color: "#D2483F", start: ["13:00"], end: ["22:00"], in: "" },
  { id: 1, name: "末永 修也", pattern: "通常勤務1", color: "#4C5FC4", start: ["09:00"], end: ["18:00"], in: "" },
  { id: 2, name: "新里 匠", pattern: "パターンなし", color: "#A9AFB6", start: ["09:00", "17:00"], end: ["12:00", "21:00"], in: "" },
  { id: 3, name: "中口 万由香", pattern: "通常勤務2", color: "#D2483F", start: ["13:00"], end: ["22:00"], in: "" },
];
const cols: ArTableColumn<Member>[] = [
  { key: "name", title: "名前", width: 132, avatar: (r) => ({ seed: r.id }), sub: (r) => ({ text: r.pattern, color: r.color }), sortable: true },
  { key: "start", title: "開始", width: 58, emphasis: "strong", numeric: true, align: "start", sortable: true },
  { key: "end", title: "終了", width: 58, emphasis: "strong", numeric: true, align: "start", sortable: true },
  { key: "in", title: "出勤", width: 60, sortable: true },
];
const foot = { name: { label: "出勤", value: "4名" }, start: { label: "シフト合計", value: "31時間00分", span: 2 }, in: { label: "打刻合計", value: "—" } };
const shown = ref(["av", "pat", "sCnt", "sShift", "sPunch", "short"]);
const options: ArViewOptionGroup[] = [
  { label: "名前の列", options: [
    { key: "av", label: "サムネ", description: "頭文字の丸（写真があれば写真）" },
    { key: "code", label: "社員コード", description: "名前の上に小さく" },
    { key: "pat", label: "パターン", description: "名前の下に色の点とパターン名" },
  ] },
  { label: "表の下", options: [
    { key: "sCnt", label: "出勤人数", description: "合計の行：その日の人数" },
    { key: "sShift", label: "シフト合計", description: "合計の行：開始〜終了の下" },
    { key: "sPunch", label: "打刻合計", description: "合計の行：出勤〜退勤の下" },
    { key: "short", label: "不足のお知らせ", description: "募集人数に足りないとき" },
  ] },
];
const availOpen = ref(true);
</script>

<template>
  <div style="position: relative; width: 390px; height: 844px; max-width: 100%; overflow: hidden; border-radius: 12px; background: #eef2f6">
    <div style="padding: 16px"><ArButton @click="open = true">10月{{ day }}日の詳細を開く</ArButton></div>
    <ArShiftDaySheet
      v-model:open="open"
      v-model:published="published"
      contained
      :label="`10月${day}日`"
      :weekday="WD[wd]"
      :weekday-tone="wd === 0 ? 'sun' : wd === 6 ? 'sat' : undefined"
      :summary="[{ label: '人件費', value: '¥36,300' }]"
      :prev-disabled="day <= 1"
      :next-disabled="day >= 31"
      @prev="day--"
      @next="day++"
    >
      <section style="display: flex; flex-direction: column; gap: 12px">
        <ArSectionHead title="勤務メンバー" icon="users" count="4名">
          <template #actions><ArButton tone="subtle" icon="calc">日毎人件費</ArButton></template>
          <template #end>
            <ArField label="表示モード" layout="toolbar">
              <ArSegmented
                v-model="mode"
                label="表示モード"
                :options="[{ value: 'time', label: '時間帯' }, { value: 'note', label: '備考', count: 2 }, { value: 'chart', label: 'チャート' }]"
              />
            </ArField>
          </template>
        </ArSectionHead>
        <ArTable :columns="cols" :rows="members" row-key="id" caption="勤務メンバー" variant="board" :footer="foot">
          <template #before-rows><ArButton tone="dashed" block icon="plus">シフト追加</ArButton></template>
          <template #below>
            <ArViewOptions v-model="shown" :groups="options" label="表示内容" title="勤務メンバーの表に出すもの" placement="top-start" />
          </template>
        </ArTable>
      </section>
      <section style="display: flex; flex-direction: column; gap: 12px; margin-top: 28px">
        <ArSectionHead v-model:open="availOpen" title="勤務可能な人" icon="inbox" count="2名" collapsible controls="sheet-avail" />
      </section>
    </ArShiftDaySheet>
  </div>
</template>
