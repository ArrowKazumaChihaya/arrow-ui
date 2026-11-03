<!-- 今の ARROW の使い方：ボタンの形 | 今の ARROW の RadioButtonGroup と同じ（選んだものは白地のまま枠と文字が antd の青）。 -->
<script setup lang="ts">
import { ArRadioGroup } from "@arrow/ui";
import { ref } from "vue";
const unit = [
  { value: "d", label: "日" },
  { value: "w", label: "週" },
  { value: "m", label: "月" },
];
const a = ref<string | null>("m");
</script>

<template>
<div class="g">
  <div><small>default</small><ArRadioGroup v-model="a" :options="unit" type="button" label="単位" /></div>
  <div><small>disabled</small><ArRadioGroup model-value="m" :options="unit" type="button" disabled label="単位" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
