<!-- 丸い札・件数の札・小さな札 | shape="pill" は線なしの丸い札（状態・件数）。件数は count で数字を等幅に（見出しの横の「4名」）。size="xs" はカレンダーのマスの「不足1」「提出2」。 -->
<script setup lang="ts">
import { ArTag } from "@arrow/ui";
</script>

<template>
<div style="display: grid; gap: 18px">
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
    <ArTag shape="pill" tone="accent" count>2</ArTag>
    <ArTag shape="pill" tone="ok">提出済</ArTag>
    <ArTag shape="pill" tone="warn">未提出</ArTag>
    <ArTag shape="pill" tone="danger">エラー</ArTag>
    <ArTag shape="pill">変更なし</ArTag>
    <ArTag shape="pill" tone="accent" count>4名</ArTag>
  </div>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
    <ArTag size="xs" tone="danger">不足1</ArTag>
    <ArTag size="xs" tone="ok">提出2</ArTag>
    <ArTag shape="pill" tone="warn" icon="eyeoff">非公開</ArTag>
    <ArTag shape="pill" icon="lock">ロック中</ArTag>
  </div>
</div>
</template>
