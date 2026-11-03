<!-- 時刻の範囲 | 2つの時刻を「〜」でつなぐ。終わりが始まり以前なら、終わりを赤くして下に直し方を出す。夜勤は overnight（29:00 など）。 -->
<script setup lang="ts">
import { ArTimeRange, ArStack, type ArTimeRangeValue } from "@arrow/ui";
import { ref } from "vue";
const a = ref<ArTimeRangeValue>({ start: "09:00", end: "18:00" });
const bad = ref<ArTimeRangeValue>({ start: "09:00", end: "08:30" });
const night = ref<ArTimeRangeValue>({ start: "22:00", end: "29:00" });
</script>

<template>
<ArStack :gap="4" align="start">
  <ArTimeRange v-model="a" label="時間" />
  <ArTimeRange v-model="a" size="sm" label="募集時間" />
  <ArTimeRange v-model="bad" label="時刻" />
  <ArTimeRange v-model="night" overnight label="夜勤" />
  <ArTimeRange :model-value="{ start: '10:00', end: '19:00' }" disabled label="使えない" />
</ArStack>
</template>
