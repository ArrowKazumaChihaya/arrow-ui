<!-- 円 | 提出率などに使う。md 96px・sm 56px。終わりは緑の輪にチェック、失敗は赤。 -->
<script setup lang="ts">
import { ArProgress, ArCluster } from "@s_and_a/arrow-ui";
</script>

<template>
<ArCluster :gap="5" align="center">
  <ArProgress type="circle" :percent="72" aria-label="提出率" />
  <ArProgress type="circle" size="sm" :percent="100" />
  <ArProgress type="circle" :percent="40" status="exception" />
  <ArProgress type="circle" size="sm" :percent="30" />
</ArCluster>
</template>
