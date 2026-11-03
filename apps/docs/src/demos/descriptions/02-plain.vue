<!-- 枠なし（日の要約） | variant="plain"：灰色のラベルと太字の値を並べる。tone で値の色（不足＝danger）。 -->
<script setup lang="ts">
import { ArDescriptions } from "@arrow/ui";
const items = [
  { key: "count", label: "出勤人数", value: "8名" },
  { key: "short", label: "不足", value: "1名", tone: "danger" as const },
  { key: "total", label: "シフト合計", value: "56:30" },
];
</script>

<template>
<ArDescriptions :items="items" variant="plain" title="10月21日（水）" />
</template>
