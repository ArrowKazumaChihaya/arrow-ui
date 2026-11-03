<!-- チェック | indeterminate は「一部だけ」を示す。 -->
<script setup lang="ts">
import { ArCheckbox, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const a = ref(true);
const b = ref(false);
</script>

<template>
<ArCluster :gap="4">
  <ArCheckbox v-model="a">店舗管理者</ArCheckbox>
  <ArCheckbox v-model="b" indeterminate>一部の店舗</ArCheckbox>
  <ArCheckbox :model-value="false" disabled>本部</ArCheckbox>
  <ArCheckbox :model-value="true" disabled>本部（固定）</ArCheckbox>
</ArCluster>
</template>
