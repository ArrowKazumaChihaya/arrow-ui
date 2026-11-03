<!-- 色の丸 | イベント・パターンの決まった色。選んでいる色は白と濃い色の2重の輪。←→で選べる。 -->
<script setup lang="ts">
import { ArColorSwatches, ArStack } from "@arrow/ui";
import { ref } from "vue";
const c = ref("#8E6BC4");
</script>

<template>
<ArStack :gap="4" align="start">
  <ArColorSwatches v-model="c" label="イベントの色" />
  <ArColorSwatches v-model="c" size="sm" label="小さい" />
  <ArColorSwatches model-value="#2E9A6B" disabled label="使えない" />
  <span class="demo-note">値：{{ c }}</span>
</ArStack>
</template>
