<!-- 種類 | primary はまとまりに1つ。secondary はやめる・戻る、subtle は見出しの横の補助、ghost は表の上の小さな操作、muted は目立たせない操作、link は文中の操作。 -->
<script setup lang="ts">
import { ArButton, ArCluster } from "@arrow/ui";
</script>

<template>
<ArCluster :gap="3" align="center">
  <ArButton tone="primary" icon="check">この内容で追加</ArButton>
  <ArButton tone="secondary">キャンセル</ArButton>
  <ArButton tone="subtle" icon="yen">日毎人件費</ArButton>
  <ArButton tone="ghost" icon="plus">行を追加</ArButton>
  <ArButton tone="muted">あとで</ArButton>
  <ArButton tone="link">リンク</ArButton>
  <ArButton tone="dashed" icon="plus">行を追加</ArButton>
</ArCluster>
</template>
