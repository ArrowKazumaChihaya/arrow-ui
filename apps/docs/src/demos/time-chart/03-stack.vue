<!-- 1日の積み上げ（その日の勤怠） | mode="stack"。実働を基本の1段、法定外残業・深夜などの割増を半段ずつ上に重ねる。休憩は空き、シフトは下の細い線。旧 ARROW の勤怠の1日のチャートと同じ見え方。 -->
<script setup lang="ts">
import { ArTimeChart } from "@s_and_a/arrow-ui";
const H = (h: number) => h * 60;
</script>

<template>
<ArTimeChart
  mode="stack"
  label="11月2日(月) の勤怠"
  :range="[H(7), H(25)]"
  :legend="['night', 'overtime', 'work', 'shift']"
  :rows="[
    { key: 'punch', label: '実働', bars: [
      { kind: 'work', start: H(8), end: H(13), name: '通常勤務' },
      { kind: 'work', start: H(14), end: H(17), name: '通常勤務' },
      { kind: 'overtime', start: H(17), end: H(24), name: '法定外残業' },
    ] },
    { key: 'over', label: '法定外残業', bars: [{ kind: 'overtime', start: H(17), end: H(24), name: '法定外残業（割増）' }] },
    { key: 'night', label: '深夜勤務', bars: [{ kind: 'night', start: H(22), end: H(24), name: '深夜勤務（割増）' }] },
    { key: 'shift', label: 'シフト', bars: [{ kind: 'shift', start: H(9), end: H(12) }, { kind: 'shift', start: H(13), end: H(18) }] },
  ]"
/>
</template>
