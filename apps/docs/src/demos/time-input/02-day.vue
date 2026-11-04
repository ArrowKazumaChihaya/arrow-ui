<!-- 前日をまたぐ（ARROW 特有） | 出勤・退勤・休始・休終は、枠と一体の［当日］を押すたびに［前日］（橙）と切り替わる。Tab では止まらない。 -->
<script setup lang="ts">
import { ArTimeInput, ArCluster, type ArTimeValue } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref<ArTimeValue>({ time: "09:00", day: "same" });
const b = ref<ArTimeValue>({ time: "21:55", day: "prev" });
const c = ref<ArTimeValue>({ time: null, day: "same" });
</script>

<template>
<ArCluster :gap="3">
  <ArTimeInput v-model="a" day-shift label="出勤" />
  <ArTimeInput v-model="b" day-shift label="出勤" />
  <ArTimeInput :model-value="{ time: '12:00', day: 'same' }" day-shift invalid label="退勤" />
  <ArTimeInput v-model="c" day-shift label="休始" />
  <ArTimeInput :model-value="{ time: '10:00', day: 'same' }" day-shift disabled label="使えない" />
</ArCluster>
</template>
