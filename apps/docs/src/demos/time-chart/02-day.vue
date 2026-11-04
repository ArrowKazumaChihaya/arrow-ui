<!-- 1日のチャート（その日の勤怠） | mode="day"。1行＝1つの内容（シフト・勤務・休憩・深夜勤務）、帯の中に時間帯の文字。目盛りは1時間ごと、範囲は帯の前後から決まる（翌日は「翌0」）。 -->
<script setup lang="ts">
import { ArTimeChart } from "@s_and_a/arrow-ui";
const H = (h: number) => h * 60;
</script>

<template>
<ArTimeChart
  mode="day"
  label="10月30日(金) の勤怠"
  :legend="['shift', 'work', 'overtime', 'break', 'night']"
  :rows="[
    { key: 'shift', label: 'シフト', bars: [{ kind: 'shift', start: H(18), end: H(27), text: '18:00〜27:00', name: 'シフト（ARROW事業部）' }] },
    { key: 'work', label: '勤務', bars: [{ kind: 'work', start: H(18), end: H(27), text: '通常勤務', minutes: 480 }] },
    { key: 'break', label: '休憩', bars: [{ kind: 'break', start: H(22), end: H(23) }] },
    { key: 'night', label: '深夜勤務', bars: [{ kind: 'night', start: H(22), end: H(27), text: '深夜', name: '深夜勤務（内数）' }] },
  ]"
/>
</template>
