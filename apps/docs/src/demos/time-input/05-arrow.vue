<!-- 今の ARROW の使い方 | 時と分の箱・前日の切り替え（day-shift）・時と分のプルダウン（select）を、今の ARROW（ui-Time）と同じ値で並べる。時間の長さ（「1 時間 30 分」）は ArDurationInput。 -->
<script setup lang="ts">
import { ArTimeInput, ArDurationInput, type ArTimeValue } from "@arrow/ui";
import { ref } from "vue";
const empty = ref<ArTimeValue>({ time: null, day: "same" });
const nine = ref<ArTimeValue>({ time: "09:00", day: "same" });
const sel = ref<ArTimeValue>({ time: "09:30", day: "same" });
const prev = ref<ArTimeValue>({ time: "23:00", day: "prev" });
const dur = ref<number | null>(90);
</script>

<template>
<div class="row">
  <div class="cell"><small>入力（空）</small><ArTimeInput v-model="empty" label="開始" /></div>
  <div class="cell"><small>入力 09:00</small><ArTimeInput v-model="nine" label="開始" /></div>
  <div class="cell"><small>プルダウン 09:30</small><ArTimeInput v-model="sel" select label="開始" /></div>
  <div class="cell"><small>前日をまたぐ</small><ArTimeInput v-model="prev" day-shift label="出勤" /></div>
  <div class="cell"><small>時間の長さ</small><ArDurationInput v-model="dur" label="休憩" /></div>
</div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-start; }
.cell { position: relative; display: flex; flex-direction: column; gap: 4px; }
small { font: 10px ui-monospace, monospace; color: #999; }
</style>
