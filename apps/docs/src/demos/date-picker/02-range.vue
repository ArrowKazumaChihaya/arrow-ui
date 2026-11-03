<!-- 範囲（RangePicker） | 1回目の押下で始まり、2回目で終わり。間は淡いテーマ色、両端は塗り、今日は線。土日は青と赤。 -->
<script setup lang="ts">
import { ArDatePicker, ArStack, type ArDateRangeValue } from "@arrow/ui";
import { ref } from "vue";
const range = ref<ArDateRangeValue>({ start: "2026-10-06", end: "2026-10-10" });
</script>

<template>
<ArStack :gap="3" align="start">
  <ArDatePicker v-model="range" range label="表示する期間" />
  <span class="demo-note">値：{{ range.start }} 〜 {{ range.end }}</span>
</ArStack>
</template>
