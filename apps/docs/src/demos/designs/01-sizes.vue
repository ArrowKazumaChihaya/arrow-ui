<!-- 大きさの段（sm・md・lg）と使い分け | どの部品も同じ3段の大きさを持ち、同じ段なら高さ・角丸・文字がそろう（新しい見た目：sm 30・md 36・lg 42、角丸 9・10・11。今の見た目：antd の 24・32・40）。sm は設定など密集した所、md はふつう、lg は年末調整・スマホなど大きく押しやすくしたい所。size を書かなければ md。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArButton, ArDateInput, ArSelect, ArTextInput, ArTimeInput, type ArTimeValue } from "@s_and_a/arrow-ui";

const steps = [
  { size: "sm", name: "sm", use: "設定・表の上の操作の段など、密集した所" },
  { size: "md", name: "md（既定）", use: "ふつうの入力の画面" },
  { size: "lg", name: "lg", use: "年末調整・スマホなど、大きく押しやすくしたい所" },
] as const;
const name = ref("山田 花子");
const kind = ref<string | number | null>("full");
const kinds = [
  { value: "full", label: "正社員" },
  { value: "part", label: "パート" },
];
const time = ref<ArTimeValue>({ time: "09:30", day: "same" });
const date = ref<string | null>("2026-11-04");
</script>

<template>
<div class="size-steps">
  <div v-for="s in steps" :key="s.size" class="size-step">
    <p class="size-step-head"><code>{{ s.name }}</code><span>{{ s.use }}</span></p>
    <div class="size-step-row" :data-step="s.size">
      <ArTextInput v-model="name" :size="s.size" label="氏名" style="width: 150px" />
      <ArSelect v-model="kind" :size="s.size" :options="kinds" label="雇用形態" style="width: 130px" />
      <ArTimeInput v-model="time" :size="s.size" label="開始" />
      <ArDateInput v-model="date" :size="s.size" label="入社日" />
      <ArButton :size="s.size" tone="primary">保存する</ArButton>
      <ArButton :size="s.size">取り消す</ArButton>
    </div>
  </div>
</div>
</template>

<style scoped>
.size-steps { display: grid; gap: 18px; }
.size-step-head { display: flex; align-items: baseline; gap: 10px; margin: 0 0 8px; font-size: 12.5px; color: #66727f; }
.size-step-head code { font-weight: 700; color: #1f2933; }
.size-step-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
</style>
