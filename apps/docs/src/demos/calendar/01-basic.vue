<!-- 基本 | 月の表示。見出しは淡いテーマ色、今日はテーマ色の丸、選んだ日はテーマ色の枠。マスの印は events（朝礼・不足1 など）。←→↑↓ で日を移り、PageUp / PageDown で月を変え、Enter で選ぶ。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArCalendar } from "@arrow/ui";
const date = ref("2026-10-15");
const month = ref("2026-10");
const events = [
  { date: "2026-10-05", label: "朝礼" },
  { date: "2026-10-14", label: "不足1", tone: "danger" as const },
  { date: "2026-10-21", label: "朝礼" },
];
</script>

<template>
<ArCalendar v-model="date" v-model:month="month" today="2026-10-21" :events="events" label="シフトのカレンダー" />
</template>
