<!-- アイコンと大きさ | icon は ArIcon の名前。文字のないボタンは label で読み上げの名前を付ける。 -->
<script setup lang="ts">
import { ArButton, ArCluster } from "@arrow/ui";
</script>

<template>
<ArCluster :gap="2" align="center">
  <ArButton tone="primary" icon="plus" size="sm">小</ArButton>
  <ArButton tone="primary" icon="plus">中</ArButton>
  <ArButton tone="primary" icon="plus" size="lg">大</ArButton>
  <ArButton tone="secondary" icon="print">印刷</ArButton>
  <ArButton tone="ghost" icon="more" label="その他の操作" />
  <ArButton tone="secondary" icon="trash" label="削除" />
</ArCluster>
</template>
