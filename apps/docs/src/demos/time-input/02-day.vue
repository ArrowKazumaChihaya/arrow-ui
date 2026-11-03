<!-- 前日をまたぐ（ARROW 特有） | 夜勤の打刻のように、日付をまたぐ時刻。「当日／前日」を押すと切り替わる。 -->
<script setup lang="ts">
import { ArTimeInput, ArCluster, type ArTimeValue } from "@arrow/ui";
import { ref } from "vue";
const a = ref<ArTimeValue>({ time: "23:30", day: "prev" });
const b = ref<ArTimeValue>({ time: "08:58", day: "same" });
</script>

<template>
<ArCluster :gap="3">
  <ArTimeInput v-model="a" day-shift label="出勤" />
  <ArTimeInput v-model="b" day-shift label="退勤" />
</ArCluster>
</template>
