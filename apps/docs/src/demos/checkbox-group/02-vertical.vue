<!-- 縦に並べる・使えない | direction="vertical"。disabled でまとめて押せなくする。 -->
<script setup lang="ts">
import { ArCheckboxGroup, ArCluster } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const items = ref<string[]>(["time", "color"]);
const opts = [
  { value: "time", label: "時間（10–19 など）" },
  { value: "break", label: "休憩時間" },
  { value: "note", label: "備考" },
  { value: "color", label: "パターンの色" },
];
</script>

<template>
<ArCluster :gap="8" align="start">
  <ArCheckboxGroup v-model="items" label="表に入れるもの" direction="vertical" check-all="すべて入れる" :options="opts" />
  <ArCheckboxGroup :model-value="['time']" label="表に入れるもの（使えない）" direction="vertical" disabled :options="opts" />
</ArCluster>
</template>
