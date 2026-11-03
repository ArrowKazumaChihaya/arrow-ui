<!-- 間違い | 終わりの日が始まりの日より前なら、両方を赤くして下に直し方を言葉で出す。showDays=false で日数を出さない。 -->
<script setup lang="ts">
import { ArDateRange, ArStack, type ArDateRangeValue } from "@arrow/ui";
import { ref } from "vue";
const bad = ref<ArDateRangeValue>({ start: "2026-11-30", end: "2026-11-01" });
const plain = ref<ArDateRangeValue>({ start: "2026-04-01", end: null });
</script>

<template>
<ArStack :gap="5" align="start">
  <ArDateRange v-model="bad" label="期間" />
  <ArDateRange v-model="plain" label="契約期間" :show-days="false" />
  <ArDateRange :model-value="{ start: '2026-04-01', end: '2027-03-31' }" disabled label="使えない" />
</ArStack>
</template>
