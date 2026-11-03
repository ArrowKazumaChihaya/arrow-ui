<!-- 大きさと状態 | sm（30）と md（38）。最小のとき − は押せない。使えない・間違い。 -->
<script setup lang="ts">
import { ArStepper, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const a = ref(1);
const b = ref(5);
</script>

<template>
<ArCluster :gap="5" align="center">
  <ArStepper v-model="a" :min="1" size="sm" label="小" />
  <ArStepper v-model="a" :min="1" variant="split" size="sm" unit="人" label="小（split）" />
  <ArStepper v-model="b" disabled label="使えない" />
  <ArStepper v-model="b" invalid :max="5" label="間違い" />
</ArCluster>
</template>
