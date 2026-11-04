<!-- 大きさ | sm 32（表の中・範囲）・md 36・lg 40（スマホのシート）。overnight は 24:00 以降（夜勤の 29:00 など）を受ける。 -->
<script setup lang="ts">
import { ArTimeInput, ArStack, ArCluster, type ArTimeValue } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const v = ref<ArTimeValue>({ time: "09:00", day: "same" });
const p = ref<ArTimeValue>({ time: "23:30", day: "prev" });
const night = ref<ArTimeValue>({ time: "29:00", day: "same" });
</script>

<template>
<ArStack :gap="3">
  <ArCluster :gap="3">
    <ArTimeInput v-model="v" size="sm" label="小" />
    <ArTimeInput v-model="v" label="中" />
    <ArTimeInput v-model="v" size="lg" label="大" />
  </ArCluster>
  <ArCluster :gap="3">
    <ArTimeInput v-model="p" size="sm" day-shift label="小" />
    <ArTimeInput v-model="p" day-shift label="中" />
    <ArTimeInput v-model="p" size="lg" day-shift label="大" />
    <ArTimeInput v-model="night" overnight label="夜勤の終わり" />
  </ArCluster>
</ArStack>
</template>
