<!-- − ＋ で挟む | joined（.stp）は枠の中に − 数 ＋。split は小さな四角いボタンで数を挟む（人数）。最小・最大で端のボタンは押せない。 -->
<script setup lang="ts">
import { ArStepper, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const day = ref(23);
const people = ref(2);
</script>

<template>
<ArCluster :gap="6" align="center">
  <ArStepper v-model="day" :min="1" :max="31" label="日" />
  <ArStepper v-model="people" variant="split" :min="1" unit="人" label="人数" />
</ArCluster>
</template>
