<!-- パネルだけ | inline でパネルをその場に出す（ポップアップの中など）。min・max の外の日は選べない。 -->
<script setup lang="ts">
import { ArDatePicker, ArCluster, type ArDateRangeValue } from "@arrow/ui";
import { ref } from "vue";
const one = ref<string | null>("2026-10-21");
const range = ref<ArDateRangeValue>({ start: "2026-10-06", end: "2026-10-10" });
</script>

<template>
<ArCluster :gap="6" align="start">
  <ArDatePicker v-model="one" inline label="日付" />
  <ArDatePicker v-model="range" inline range label="期間" />
  <ArDatePicker model-value="2026-10-21" inline :confirm="false" min="2026-10-05" max="2026-10-25" label="選べる日が決まっている" />
</ArCluster>
</template>
