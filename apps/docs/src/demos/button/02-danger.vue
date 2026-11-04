<!-- 削除 | 取り消せない操作は赤。確かめの画面で最後に押すときだけ塗り（danger / danger-fill）。ふだんは枠（danger-subtle / danger-outline）か文字だけ（danger-ghost）。 -->
<script setup lang="ts">
import { ArButton, ArCluster } from "@s_and_a/arrow-ui";
</script>

<template>
<ArCluster :gap="3" align="center">
  <ArButton tone="danger-fill">削除する</ArButton>
  <ArButton tone="danger-outline">削除</ArButton>
  <ArButton tone="danger-ghost" icon="trash">削除</ArButton>
  <ArButton tone="danger-ghost" icon="trash" label="削除" />
</ArCluster>
</template>
