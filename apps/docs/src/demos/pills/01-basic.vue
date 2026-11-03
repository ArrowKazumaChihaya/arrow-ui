<!-- 選ぶ札 | 絞り込みの選択（高さ30・丸い札）。選んでいる札は淡いテーマ色。1つ選ぶ（既定）か multiple でいくつでも。 -->
<script setup lang="ts">
import { ArPills, ArStack, type ArPillValue } from "@arrow/ui";
import { ref } from "vue";
const who = ref<ArPillValue | null>("all");
const kinds = ref<ArPillValue[]>(["shift", "event"]);
</script>

<template>
<ArStack :gap="4" align="start">
  <ArPills
    v-model="who"
    label="表示する人"
    :options="[
      { value: 'all', label: '全員' },
      { value: 'suenaga', label: '末永' },
      { value: 'nakaguchi', label: '中口' },
    ]"
  />
  <ArPills
    v-model="kinds"
    multiple
    label="表示する内容"
    :options="[
      { value: 'shift', label: 'シフト', count: 12 },
      { value: 'event', label: 'イベント', count: 3 },
      { value: 'off', label: '休み希望', count: 0 },
      { value: 'lock', label: '確定済み', disabled: true },
    ]"
  />
</ArStack>
</template>
