<!-- 例を入れて確かめる（1行） | variant="inline"。例の入力を default スロットに置き、結果（result）は入れるたびに変わる。丸め設定の「例で確かめる」。 -->
<script setup lang="ts">
import { ArExample, ArTimeInput, ArStack, type ArTimeValue } from "@s_and_a/arrow-ui";
import { computed, ref } from "vue";
const inT = ref<ArTimeValue>({ time: "08:57", day: "same" });
const outT = ref<ArTimeValue>({ time: "17:08", day: "same" });
const toM = (t?: string | null) => { const [h, m] = (t ?? "").split(":").map(Number); return Number.isFinite(h) && Number.isFinite(m) ? h! * 60 + m! : null; };
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const result = computed(() => {
  const a = toM(inT.value.time), b = toM(outT.value.time);
  if (a === null || b === null) return { t: "時刻を入れてください", tone: "warn" as const };
  const s = Math.max(a, 9 * 60); // シフトに合わせる（09:00 より前は 09:00）
  const e = b <= 17 * 60 ? b : Math.round(b / 10) * 10; // 10分単位で四捨五入（シフトの外側だけ）
  return { t: `勤務 ${fmt(s)}〜${fmt(e)}`, tone: "accent" as const };
});
</script>

<template>
<ArStack :gap="3" style="width: 760px; max-width: 100%">
  <ArExample variant="inline" :result="result.t" :result-tone="result.tone" result-icon="clock">
    <span>シフト 09:00〜17:00 ／ 打刻</span>
    <ArTimeInput v-model="inT" size="sm" label="出勤の打刻" />
    <span aria-hidden="true">〜</span>
    <ArTimeInput v-model="outT" size="sm" label="退勤の打刻" />
  </ArExample>
  <ArExample variant="inline" result="休憩 11:55〜13:10" result-icon="clock">
    <span>休憩の打刻 11:57〜13:08</span>
  </ArExample>
</ArStack>
</template>
