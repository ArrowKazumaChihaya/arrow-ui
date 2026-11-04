<!-- 管理者の給与明細（前月と比べる） | size="sm"。4列目は表を上から並べる（その他・差引支給額・振込支給額・そのほか）。合計は total、差引支給額は big。compare="prev" で値の右に「前 ○○」と差。手で直した金額は edited（ペンの印）、マイナスは赤。見出しの右は toolbar の slot。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArThemeScope, ArPayslip, ArSegmented } from "@s_and_a/arrow-ui";
import type { ArPayslipSection } from "@s_and_a/arrow-ui";
const mode = ref<"off" | "prev">("prev");
const att: ArPayslipSection = { title: "勤怠", rows: [
  ["通常勤務時間", "160:00"], ["法定内残業勤務時間", "2:00"], ["早退日数", "0日"], ["遅刻日数", "1日"], ["欠勤日数", "0日"], ["有給休暇日数", "1日"], ["通常出勤日数", "19日"], ["法定外残業勤務時間", "7:00"], ["遅刻時間", "0:15"], ["有給残日数", "8日"],
].map(([label, value]) => ({ label: label!, value: value! })) };
const pay: ArPayslipSection = { title: "支給", rows: [
  { label: "その他手当", value: 0, prev: 0 }, { label: "基本給", value: 253000, prev: 253000 }, { label: "残業手当", value: 18600, prev: 16400 }, { label: "休日手当", value: 0, prev: 0 },
  { label: "有給手当", value: 11500, prev: 0 }, { label: "通勤手当", value: 14653, prev: 14653 }, { label: "前月調整", value: -3200, prev: 0, edited: true },
  { label: "合計", value: 294553, prev: 284053, total: true },
] };
const ded: ArPayslipSection = { title: "控除", rows: [
  { label: "所得税", value: 10430, prev: 9700 }, { label: "健康保険", value: 14369, prev: 14369 }, { label: "厚生年金保険", value: 26535, prev: 26535 }, { label: "雇用保険", value: 1620, prev: 1562 },
  { label: "住民税", value: 12400, prev: 12400, edited: true }, { label: "子ども子育て支援金", value: 333, prev: 333 }, { label: "合計", value: 65687, prev: 64899, total: true },
] };
const other: ArPayslipSection[] = [
  { title: "その他", rows: [{ label: "年末調整", value: 0, prev: 0 }, { label: "精算金", value: 0, prev: 0 }, { label: "合計", value: 0, prev: 0, total: true }] },
  { title: "差引支給額", rows: [{ label: "差引支給額", value: 228866, prev: 219154, total: true, big: true }] },
  { title: "振込支給額", rows: [{ label: "三菱UFJ銀行", value: 228866, prev: 219154 }, { label: "合計", value: 228866, prev: 219154, total: true }] },
  { title: "そのほか", rows: [{ label: "現金支給額", value: 0, prev: 0 }, { label: "課税累計額", value: 2927400 }, { label: "税額表区分", value: "甲" }] },
];
</script>

<template>
  <ArThemeScope palette="yellow"><div style="max-width: 1320px">
    <ArPayslip
      size="sm"
      title="給与明細書"
      period="2026年11月13日支給分"
      :meta="[{ label: '会社', value: '株式会社テスト（by 株式会社S&A）' }, { label: '所属', value: 'ARROW事業部' }, { label: '名前', value: '中口 万由香' }]"
      :columns="[att, pay, ded, other]"
      :compare="mode"
    >
      <template #toolbar>
        <ArSegmented v-model="mode" label="見比べ" :options="[{ value: 'off', label: '明細だけ' }, { value: 'prev', label: '前月と比べる' }]" />
      </template>
    </ArPayslip>
  </div></ArThemeScope>
</template>
