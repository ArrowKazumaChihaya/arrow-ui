<!-- 時刻 | 高さ36・角丸9。数字を打つ（「930」「９：３０」も 09:30）か、↑↓で step ずつ動かす。確定（Enter・フォーカスが外れる）で commit が出る。読めない時刻は赤い枠。 -->
<script setup lang="ts">
import { ArTimeInput, ArCluster, type ArTimeValue } from "@arrow/ui";
import { ref } from "vue";
const start = ref<ArTimeValue>({ time: "10:00", day: "same" });
const empty = ref<ArTimeValue>({ time: null, day: "same" });
const last = ref("");
</script>

<template>
<ArCluster :gap="3" align="center">
  <ArTimeInput v-model="start" label="開始" @commit="(v) => (last = v.time ?? '')" />
  <ArTimeInput v-model="empty" label="未入力" />
  <ArTimeInput :model-value="{ time: '08:30', day: 'same' }" invalid label="間違い" />
  <ArTimeInput :model-value="{ time: '10:00', day: 'same' }" disabled label="使えない" />
  <ArTimeInput :model-value="{ time: null, day: 'same' }" note="打刻と同じ" label="出勤" />
  <span class="demo-note">確定した値：{{ last || "—" }}</span>
</ArCluster>
</template>
