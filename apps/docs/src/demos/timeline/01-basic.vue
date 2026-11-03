<!-- 基本 | 打刻・承認の履歴。点は意味の色（tone）、今は status="current"（テーマ色の塗り）、まだは status="pending"（灰色）。 -->
<script setup lang="ts">
import { ArTimeline } from "@arrow/ui";
const items = [
  { title: "出勤", description: "08:58 渋谷店（位置情報あり）", tone: "ok" as const },
  { title: "休憩開始", description: "12:02" },
  { title: "休憩終了", description: "13:00", status: "current" as const },
  { title: "退勤（まだ）", description: "予定 18:00", status: "pending" as const },
];
</script>

<template>
<ArTimeline :items="items" label="今日の打刻" />
</template>
