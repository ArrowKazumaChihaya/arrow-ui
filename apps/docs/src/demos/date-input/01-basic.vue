<!-- 日付（曜日つき） | 年・月・日を分けて選ぶ。土日は色が変わる。 -->
<script setup lang="ts">
import { ArDateInput, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const d = ref<string | null>("2026-10-24");
const e = ref<string | null>(null);
</script>

<template>
<ArCluster :gap="4">
  <ArDateInput v-model="d" label="勤務日" />
  <ArDateInput v-model="e" label="未入力" />
  <ArDateInput v-model="d" :show-weekday="false" label="曜日なし" />
</ArCluster>
</template>
