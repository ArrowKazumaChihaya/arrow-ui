<!-- 例の箱 | 設定がどう効くかを例で見せる。見出し（i の印）と「項目｜値」の行。tag で見出しの横に札、値は tone で色を変える。 -->
<script setup lang="ts">
import { ArExample, ArStack } from "@arrow/ui";
const rate = [
  { label: "法定外残業", value: "1,320円（×120%）", tone: "danger" as const },
  { label: "深夜の法定外残業", value: "1,595円（×145%）" },
  { label: "60時間を超えた法定外残業", value: "1,595円（×145%）" },
  { label: "法定休日", value: "1,430円（×130%）", tone: "danger" as const },
];
const pay = [
  { label: "勤怠の期間（11月分）", value: "2026年11月1日〜11月30日" },
  { label: "給与の支給日", value: "2026年12月15日（火）" },
  { label: "社会保険料", value: "11月分を12月に支給する給与から控除" },
];
</script>

<template>
<ArStack :gap="4" style="width: 1032px; max-width: 100%">
  <ArExample title="時給1,100円の人の1時間あたり（例）" :rows="rate" />
  <ArExample title="この設定での流れ（例：11月分）" :rows="pay" />
  <ArExample title="次に登録する社員の社員コード" tag="提案" :rows="[{ label: '次の番号', value: 'A-0035', tone: 'accent' }, { label: '形式', value: '英字1文字＋ハイフン＋4桁', tone: 'muted' }]" />
</ArStack>
</template>
