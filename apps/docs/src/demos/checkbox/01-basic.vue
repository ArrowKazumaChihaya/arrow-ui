<!-- チェック | 18px・角丸5。チェックしたものと「一部だけ」（indeterminate）はテーマ色、indeterminate は白い横線。 -->
<script setup lang="ts">
import { ArCheckbox, ArCluster } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref(true);
const b = ref(false);
const c = ref(false);
</script>

<template>
<ArCluster :gap="5">
  <ArCheckbox v-model="a">店舗管理者</ArCheckbox>
  <ArCheckbox v-model="b">一般</ArCheckbox>
  <ArCheckbox v-model="c" indeterminate>すべて（一部）</ArCheckbox>
  <ArCheckbox :model-value="false" disabled>使えない</ArCheckbox>
  <ArCheckbox :model-value="true" disabled>使えない（入）</ArCheckbox>
</ArCluster>
</template>
