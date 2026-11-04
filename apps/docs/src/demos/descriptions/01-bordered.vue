<!-- 枠つき | variant="bordered"：角丸12の枠、ラベルの地は淡いテーマ色（acc-25）。column で1行の数、span で横につなぐ。#item-<key> で値を差し替える。 -->
<script setup lang="ts">
import { ArDescriptions, ArTag } from "@s_and_a/arrow-ui";
const items = [
  { key: "name", label: "氏名", value: "佐藤 美咲" },
  { key: "code", label: "社員コード", value: "A-1024" },
  { key: "type", label: "雇用形態" },
  { key: "store", label: "所属", value: "渋谷店" },
  { key: "joined", label: "入社日", value: "2024/04/01" },
  { key: "wage", label: "時給", value: "¥1,200" },
  { key: "note", label: "備考", value: "火曜は午前のみ", span: 3 },
];
</script>

<template>
<ArDescriptions :items="items">
  <template #item-type><ArTag tone="accent">パート</ArTag></template>
</ArDescriptions>
</template>
