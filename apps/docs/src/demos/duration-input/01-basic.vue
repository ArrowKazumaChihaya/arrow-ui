<!-- 時間の長さ | 「1 時間 30 分」のように時間と分の2つの箱で打つ。値は分（90）。分を打ち終える・箱から出ると確定する。 -->
<script setup lang="ts">
import { ArDurationInput, ArCluster } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref<number | null>(90);
const b = ref<number | null>(null);
</script>

<template>
<ArCluster :gap="4" align="center">
  <ArDurationInput v-model="a" label="休憩" />
  <ArDurationInput v-model="b" label="残業" />
  <ArDurationInput :model-value="480" invalid label="間違い" />
  <ArDurationInput :model-value="45" disabled label="使えない" />
  <span class="demo-note">値：{{ a ?? "—" }} 分</span>
</ArCluster>
</template>
