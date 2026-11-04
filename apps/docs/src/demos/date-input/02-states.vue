<!-- 状態 | 未入力（月日が空なら値は null）・間違い（invalid）・使えない。 -->
<script setup lang="ts">
import { ArDateInput, ArStack } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const empty = ref<string | null>(null);
</script>

<template>
<ArStack :gap="3" align="start">
  <ArDateInput v-model="empty" label="未入力" />
  <ArDateInput model-value="2026-11-30" invalid label="間違い" />
  <ArDateInput model-value="2026-10-21" disabled label="使えない" />
</ArStack>
</template>
