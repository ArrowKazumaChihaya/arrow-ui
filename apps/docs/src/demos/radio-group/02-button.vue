<!-- ボタン型 | type="button" は Segmented と同じ形（地は ln-2、選んでいるものは白い面にテーマ色の文字）。block で幅いっぱい。 -->
<script setup lang="ts">
import { ArRadioGroup, ArStack } from "@arrow/ui";
import { ref } from "vue";
const unit = ref("day");
const shape = ref("week");
const paper = ref("a4");
</script>

<template>
<ArStack :gap="4" align="start">
  <ArRadioGroup
    v-model="unit"
    type="button"
    label="表示の単位"
    :options="[
      { value: 'day', label: '日' },
      { value: 'week', label: '週' },
      { value: 'month', label: '月' },
    ]"
  />
  <div style="width: 300px">
    <ArRadioGroup
      v-model="shape"
      type="button"
      block
      label="表の形"
      :options="[
        { value: 'week', label: '週' },
        { value: 'half', label: '半月' },
        { value: 'month', label: '月' },
      ]"
    />
  </div>
  <ArRadioGroup
    v-model="paper"
    type="button"
    label="用紙"
    :options="[
      { value: 'a4', label: 'A4' },
      { value: 'a3', label: 'A3' },
      { value: 'b4', label: 'B4', disabled: true },
    ]"
  />
</ArStack>
</template>
