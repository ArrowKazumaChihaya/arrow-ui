<!-- リンク | 文中の行き先。テーマ色の文字と下線。別のタブで開くなら target="_blank"。 -->
<script setup lang="ts">
import { ArLink, ArCluster } from "@arrow/ui";
</script>

<template>
<ArCluster :gap="5" align="center">
  <ArLink href="#link">使い方を見る</ArLink>
  <ArLink href="https://example.com" target="_blank" icon="help">ヘルプ（別のタブ）</ArLink>
  <ArLink href="#link" :underline="false">下線なし</ArLink>
  <ArLink href="#link" type="secondary">補足のリンク</ArLink>
  <ArLink href="#link" type="danger">退職の手続き</ArLink>
  <ArLink href="#link" disabled>押せないリンク</ArLink>
</ArCluster>
</template>
