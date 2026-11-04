<!-- 今の ARROW の使い方：ダウンロード | 今の ARROW の Download は href を渡した ArButton（a 要素）。add＋ダウンロードのアイコン、cancel は文字だけ（幅200px）。 -->
<script setup lang="ts">
import { ArButton } from "@s_and_a/arrow-ui";
</script>

<template>
<div class="g">
  <div style="width: 200px"><small>add</small><ArButton tone="primary" icon="dl" href="#download" block>ダウンロード</ArButton></div>
  <div style="width: 200px"><small>cancel</small><ArButton tone="secondary" href="#download" block>ひな形</ArButton></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
