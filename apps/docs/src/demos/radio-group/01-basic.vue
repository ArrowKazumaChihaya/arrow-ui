<!-- ラジオ | 形を省くとカード（variant="card"・年末調整の なし／あり と同じ形。classic は今の ARROW と同じ丸と文字）。丸は 18px、選ぶと枠5のテーマ色。7つ以上なら ArSelect。←→↑↓で選べる。 -->
<script setup lang="ts">
import { ArRadioGroup, ArStack } from "@arrow/ui";
import { ref } from "vue";
const scope = ref("once");
const opts = [
  { value: "once", label: "次の回だけ" },
  { value: "after", label: "これ以降すべて" },
  { value: "all", label: "すべて" },
];
</script>

<template>
<ArStack :gap="5">
  <ArRadioGroup v-model="scope" label="変える範囲" :options="opts" />
  <ArRadioGroup v-model="scope" label="変える範囲（縦）" direction="vertical" :options="opts" />
  <ArRadioGroup
    model-value="once"
    label="使えない"
    :options="[
      { value: 'once', label: '次の回だけ', disabled: true },
      { value: 'after', label: 'これ以降すべて', disabled: true },
      { value: 'all', label: 'すべて' },
    ]"
  />
</ArStack>
</template>
