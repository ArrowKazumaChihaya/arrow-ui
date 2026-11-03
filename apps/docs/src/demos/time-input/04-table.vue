<!-- 時間の表（列いっぱい） | block で列の幅いっぱい。勤務メンバーの表と同じ並び（シフト・勤怠・休憩）。打刻がないときは「打刻と同じ」。 -->
<script setup lang="ts">
import { ArTimeInput, type ArTimeValue } from "@arrow/ui";
import { reactive } from "vue";
const t = (time: string | null, day: "same" | "prev" = "same"): ArTimeValue => ({ time, day });
const rows = reactive([
  { s: t("09:00"), e: t("12:00"), in: t("08:56"), out: t("12:03"), bs: t(null), be: t(null) },
  { s: t("17:00"), e: t("21:00"), in: t("16:58"), out: t("21:05"), bs: t(null), be: t(null) },
]);
</script>

<template>
<div class="tt">
  <span class="g" style="grid-column: span 2; --gc: var(--ar-accent-strong)">シフト</span>
  <span class="g" style="grid-column: span 2; --gc: var(--ar-color-text)">勤怠（打刻）</span>
  <span class="g" style="grid-column: span 2; --gc: var(--ar-color-text-faint)">休憩</span>
  <span class="h">開始</span><span class="h">終了</span><span class="h">出勤</span><span class="h">退勤</span><span class="h">休始</span><span class="h">休終</span>
  <div class="c"><ArTimeInput v-for="(r, i) in rows" :key="i" v-model="r.s" block :label="`${i + 1}行目の開始`" /></div>
  <div class="c"><ArTimeInput v-for="(r, i) in rows" :key="i" v-model="r.e" block :label="`${i + 1}行目の終了`" /></div>
  <div class="c"><ArTimeInput v-for="(r, i) in rows" :key="i" v-model="r.in" block day-shift :label="`${i + 1}行目の出勤`" /></div>
  <div class="c"><ArTimeInput v-for="(r, i) in rows" :key="i" v-model="r.out" block day-shift :label="`${i + 1}行目の退勤`" /></div>
  <div class="c"><ArTimeInput v-for="(r, i) in rows" :key="i" v-model="r.bs" block day-shift :label="`${i + 1}行目の休始`" /></div>
  <div class="c"><ArTimeInput v-for="(r, i) in rows" :key="i" v-model="r.be" block day-shift :label="`${i + 1}行目の休終`" /></div>
</div>
<div class="tt" style="margin-top: 16px; grid-template-columns: repeat(2, 72px) repeat(2, 100px)">
  <span class="h">開始</span><span class="h">終了</span><span class="h">出勤</span><span class="h">退勤</span>
  <div class="c"><ArTimeInput :model-value="t(null)" block note="打刻と同じ" label="開始" /></div>
  <div class="c"><ArTimeInput :model-value="t(null)" block note="打刻と同じ" label="終了" /></div>
  <div class="c"><ArTimeInput :model-value="t(null)" block day-shift label="出勤" /></div>
  <div class="c"><ArTimeInput :model-value="t(null)" block day-shift label="退勤" /></div>
</div>
</template>

<style scoped>
.tt { display: grid; grid-template-columns: repeat(2, 66px) repeat(4, 100px); column-gap: 8px; align-items: start; width: max-content; max-width: 100%; padding: 8px 12px 12px; background: var(--ar-color-surface-alt); border: 1px solid var(--ar-color-border); border-radius: 10px; box-sizing: border-box; }
.g { padding: 4px 2px 6px; border-bottom: 2px solid var(--gc); font-size: 12px; font-weight: 700; color: var(--ar-color-text); }
.h { padding: 8px 2px 6px; font-size: 11.5px; font-weight: 700; color: var(--ar-color-text-muted); }
.c { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
</style>
