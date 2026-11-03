<!-- 今の ARROW の使い方 | 今の ARROW の Radio・RadioGroup と同じ並び（選んだ丸は antd の青）。縦は direction="vertical"。 -->
<script setup lang="ts">
import { ArRadioGroup } from "@arrow/ui";
import { ref } from "vue";
const pay = [
  { value: 1, label: "月給" },
  { value: 2, label: "日給" },
  { value: 3, label: "時給" },
];
const h = ref<number | null>(1);
const v = ref<number | null>(2);
</script>

<template>
<div class="g">
  <div><small>unchecked</small><ArRadioGroup :model-value="null" :options="[{ value: 1, label: '選択肢' }]" label="選択肢" /></div>
  <div><small>checked</small><ArRadioGroup :model-value="1" :options="[{ value: 1, label: '選択肢' }]" label="選択肢" /></div>
  <div><small>disabled</small><ArRadioGroup :model-value="null" :options="[{ value: 1, label: '無効', disabled: true }]" label="無効" /></div>
  <div><small>checked disabled</small><ArRadioGroup :model-value="1" :options="[{ value: 1, label: '無効' }]" disabled label="無効" /></div>
</div>
<div class="g" style="margin-top: 16px">
  <div><small>horizontal</small><ArRadioGroup v-model="h" :options="pay" label="給与の形" /></div>
  <div><small>vertical</small><ArRadioGroup v-model="v" :options="pay" direction="vertical" label="給与の形" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
