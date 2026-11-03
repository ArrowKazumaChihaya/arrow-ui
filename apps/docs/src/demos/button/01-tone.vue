<!-- 種類 | primary はまとまりに1つ。取り消しにくい操作は danger。 -->
<script setup lang="ts">
import { ArButton, ArCluster } from "@arrow/ui";
</script>

<template>
<ArCluster :gap="2">
  <ArButton tone="primary">この内容で追加</ArButton>
  <ArButton tone="secondary">キャンセル</ArButton>
  <ArButton tone="subtle">日毎人件費</ArButton>
  <ArButton tone="ghost">使い方</ArButton>
  <ArButton tone="dashed">行を足す</ArButton>
  <ArButton tone="danger">削除</ArButton>
  <ArButton tone="danger-subtle">取り消す</ArButton>
</ArCluster>
</template>
