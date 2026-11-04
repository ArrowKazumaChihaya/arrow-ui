<!-- 変わる項目の表と一覧（保存前の確認） | items を渡すと「項目｜変更前｜変更後」の表（layout="table"）。狭い所（スマホの確認）では1列の一覧（layout="list"）。金額は numeric で右に寄せる。 -->
<script setup lang="ts">
import { ArChangedValue, ArStack } from "@s_and_a/arrow-ui";
const cfg = [
  { label: "シフトサマリー計算期間", before: "月単位", after: "給与計算期間" },
  { label: "シフト提出", before: "店舗/部署ごとに提出", after: "全ての店舗/部署に一括提出" },
  { label: "シフト管理対象", before: "パート・アルバイト・社員・その他", after: "パート・アルバイト・社員・役員・その他" },
];
const pay = [
  { label: "末永 修也　残業手当", before: "21,840", after: "24,960" },
  { label: "中口 万由香　住民税", before: "12,400", after: "12,600" },
  { label: "松田 照恵　有給手当", before: "8,640", after: "10,800" },
];
</script>

<template>
<ArStack :gap="5">
  <div style="width: 572px; max-width: 100%"><ArChangedValue :items="cfg" caption="基本設定で変わる項目" /></div>
  <div style="width: 572px; max-width: 100%"><ArChangedValue :items="pay" numeric :headers="{ label: '氏名・項目', before: '今', after: '新しい金額' }" caption="給与で変わる金額" /></div>
  <div style="width: 342px; max-width: 100%"><ArChangedValue :items="cfg" layout="list" caption="基本設定で変わる項目" /></div>
</ArStack>
</template>
