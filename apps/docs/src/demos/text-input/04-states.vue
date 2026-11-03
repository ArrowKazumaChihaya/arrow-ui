<!-- 大きさと状態 | sm（30）・md（38）・lg（44）。間違い（赤）・注意（黄）・使えない・読み取りのみ・filled（枠なしの灰色）。 -->
<script setup lang="ts">
import { ArTextInput, ArCluster, ArStack } from "@arrow/ui";
import { ref } from "vue";
const v = ref("");
</script>

<template>
<ArStack :gap="4">
  <ArCluster :gap="2" align="center" wrap="wrap">
    <ArTextInput v-model="v" size="sm" placeholder="小" label="小" style="width: 140px" />
    <ArTextInput v-model="v" placeholder="ふつう" label="ふつう" style="width: 140px" />
    <ArTextInput v-model="v" size="lg" placeholder="大" label="大" style="width: 140px" />
  </ArCluster>
  <ArCluster :gap="2" align="center" wrap="wrap">
    <ArTextInput model-value="間違い" invalid label="間違い" style="width: 140px" />
    <ArTextInput model-value="注意" warning label="注意" style="width: 140px" />
    <ArTextInput model-value="使えない" disabled label="使えない" style="width: 140px" />
    <ArTextInput model-value="ARR-00123" readonly label="読み取りのみ" style="width: 140px" />
    <ArTextInput v-model="v" variant="filled" placeholder="filled" label="filled" style="width: 140px" />
  </ArCluster>
</ArStack>
</template>
