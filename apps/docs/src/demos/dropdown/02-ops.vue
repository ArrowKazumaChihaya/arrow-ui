<!-- 説明つきのメニュー | description を渡すと、シフト画面の「操作」メニューと同じ2行の項目（アイコンの箱・太字・説明）。group で見出し（「登録する」「見る・出力する」）。 -->
<script setup lang="ts">
import { ArDropdown, type ArMenuItem } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const open = ref(true);
const ops: ArMenuItem[] = [
  { key: "g1", type: "group", label: "登録する", children: [
    { key: "recruit", label: "シフト募集", icon: "mega", description: "従業員に希望シフトを出してもらう" },
    { key: "bulk", label: "シフト一括登録", icon: "layers", description: "複数の日・人へパターンでまとめて登録" },
    { key: "excel", label: "Excel登録", icon: "sheet", description: "Excelファイルから読み込む" },
    { key: "pub", label: "公開期間設定", icon: "eye", description: "従業員に見せる期間を決める" },
  ] },
  { key: "g2", type: "group", label: "見る・出力する", children: [
    { key: "table", label: "勤務表", icon: "files", description: "勤務表を出力する" },
    { key: "print", label: "シフト表(印刷用)", icon: "print", description: "印刷用のシフト表を作る" },
    { key: "summary", label: "シフトサマリー", icon: "chart", description: "日ごと・人ごとの人数と時間" },
  ] },
  { key: "hr", type: "divider" },
  { key: "del", label: "シフト一括削除", icon: "trash", danger: true, description: "期間と人を選んでまとめて削除" },
];
</script>

<template>
<div style="display: flex; justify-content: flex-end; max-width: 520px; padding-bottom: 470px">
  <ArDropdown v-model:open="open" :items="ops" variant="ops" icon="hand2" label="操作" placement="bottom-end" :width="286" />
</div>
</template>
