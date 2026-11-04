<!-- マイページの給与明細 | 勤怠／支給／控除／その他の4列と、下に合計の箱。「前回と比べる」は compare="diff"（値の下に差）。差は prev（前回の値）から自動で計算するか、時間・日数などは diff に文字で渡す。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArThemeScope, ArPayslip, ArSwitch } from "@s_and_a/arrow-ui";
import type { ArPayslipSection, ArPayslipTotal } from "@s_and_a/arrow-ui";
const cmp = ref(false);
const columns: ArPayslipSection[] = [
  { title: "勤怠", rows: [
    { label: "出勤日数", value: "17日", diff: "+1" }, { label: "有給休暇", value: "1日", diff: "+1" }, { label: "欠勤日数", value: "0日" },
    { label: "労働時間", value: "134:42", diff: "+7:51" }, { label: "残業時間", value: "2:30", diff: "−1:00" }, { label: "深夜時間", value: "0:00" }, { label: "遅刻早退時間", value: "0:12", diff: "+0:12" },
  ] },
  { title: "支給", rows: [
    { label: "基本給", value: 250000 }, { label: "役職手当", value: 30000 }, { label: "残業手当", value: 4885, prev: 6839 }, { label: "通勤手当（非課税）", value: 10200, prev: 9600 },
  ] },
  { title: "控除", rows: [
    { label: "健康保険料", value: 14850 }, { label: "厚生年金保険料", value: 27450 }, { label: "雇用保険料", value: 1770, prev: 1776 }, { label: "所得税", value: 6420, prev: 6500 }, { label: "住民税", value: 13900 },
  ] },
  { title: "その他", rows: [
    { label: "課税累計額", value: 2712300 }, { label: "社会保険累計額", value: 437000 }, { label: "税額表区分", value: "甲" }, { label: "扶養人数", value: "0人" },
  ] },
];
const totals: ArPayslipTotal[] = [
  { label: "総支給額", value: 295085, prev: 296439 }, { label: "控除合計", value: 64390, prev: 64476 }, { label: "差引支給額", value: 230695, prev: 231963, emphasis: true },
  { label: "振込支給額", value: 230695 }, { label: "現金支給額", value: 0 },
];
</script>

<template>
  <ArThemeScope palette="yellow"><div style="display: flex; flex-direction: column; gap: 12px; max-width: 1320px">
    <label style="display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700"><ArSwitch v-model="cmp" label="前回と比べる" />前回と比べる</label>
    <ArPayslip
      title="給与明細書"
      period="2026年11月25日支給分"
      :meta="[{ label: '会社', value: '株式会社アロー' }, { label: '所属', value: 'ARROW事業部' }, { label: '氏名', value: '千速 一真 様' }, { label: '社員コード', value: '0001' }]"
      :columns="columns"
      :totals="totals"
      :compare="cmp ? 'diff' : 'off'"
    />
  </div></ArThemeScope>
</template>
