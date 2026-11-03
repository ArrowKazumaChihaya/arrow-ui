<!-- 時刻 | 数字を打つか、↑↓で step ずつ動かす。確定（Enter・フォーカスが外れる）で commit が出る。 -->
<script setup lang="ts">
import { ArTimeInput, ArCluster, type ArTimeValue } from "@arrow/ui";
import { ref } from "vue";
const start = ref<ArTimeValue>({ time: "09:00", day: "same" });
const empty = ref<ArTimeValue>({ time: null, day: "same" });
const last = ref("");
</script>

<template>
<ArCluster :gap="3" align="center">
  <ArTimeInput v-model="start" label="開始" @commit="(v) => (last = v.time ?? '')" />
  <ArTimeInput v-model="empty" label="未入力" />
  <ArTimeInput v-model="start" size="sm" label="小" />
  <ArTimeInput v-model="start" disabled label="押せない" />
  <span class="demo-note">確定した値：{{ last || "—" }}</span>
</ArCluster>
</template>
