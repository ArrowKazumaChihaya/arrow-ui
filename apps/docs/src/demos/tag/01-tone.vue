<!-- 意味の色 | 角丸7・高さ24。意味の色はどのページでも同じ（提出済＝緑、未提出＝橙、エラー＝赤、イベント＝紫）。種類はテーマ色の淡い札、店長などはテーマ色の塗り。色だけで伝えず、必ず言葉を入れる。 -->
<script setup lang="ts">
import { ArTag } from "@arrow/ui";
</script>

<template>
<div style="display: grid; gap: 12px">
  <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center">
    <ArTag>標準</ArTag>
    <ArTag tone="accent">パート</ArTag>
    <ArTag tone="solid">店長</ArTag>
    <ArTag tone="ok" icon="check">提出済</ArTag>
    <ArTag tone="warn">未提出</ArTag>
    <ArTag tone="danger">エラー</ArTag>
    <ArTag tone="event">イベント</ArTag>
  </div>
  <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center">
    <ArTag size="sm" tone="accent">v6.6 新</ArTag>
    <ArTag size="sm">小さい札</ArTag>
    <ArTag size="sm" tone="danger" icon="alert">要確認</ArTag>
  </div>
</div>
</template>
