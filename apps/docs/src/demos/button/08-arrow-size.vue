<!-- 今の ARROW の種類：大きさ | small→sm（24）・なし→md（32）・large→lg（40）・xlarge→xl（50）。square はアイコンだけ（label で名前を付ける）。 -->
<script setup lang="ts">
import { ArButton } from "@arrow/ui";
</script>

<template>
<div class="g">
  <div><small>add small</small><ArButton tone="primary" size="sm" block>登録する</ArButton></div>
  <div><small>add default</small><ArButton tone="primary" block>登録する</ArButton></div>
  <div><small>add large</small><ArButton tone="primary" size="lg" block>登録する</ArButton></div>
  <div class="w"><small>add xlarge</small><ArButton tone="primary" size="xl" block>登録する</ArButton></div>
  <div><small>add+icon small</small><ArButton tone="primary" size="sm" icon="plus" block>追加</ArButton></div>
  <div><small>add+icon default</small><ArButton tone="primary" icon="plus" block>追加</ArButton></div>
  <div><small>add+icon large</small><ArButton tone="primary" size="lg" icon="plus" block>追加</ArButton></div>
  <div class="w"><small>add+icon xlarge</small><ArButton tone="primary" size="xl" icon="plus" block>追加</ArButton></div>
  <div><small>cancel small</small><ArButton tone="secondary" size="sm" block>キャンセル</ArButton></div>
  <div><small>cancel default</small><ArButton tone="secondary" block>キャンセル</ArButton></div>
  <div><small>cancel large</small><ArButton tone="secondary" size="lg" block>キャンセル</ArButton></div>
  <div class="w"><small>cancel xlarge</small><ArButton tone="secondary" size="xl" block>キャンセル</ArButton></div>
  <div><small>square add+plus</small><span><ArButton tone="primary" icon="plus" label="追加" /></span></div>
  <div><small>square edit+edit</small><span><ArButton tone="edit" icon="pen" label="編集" /></span></div>
  <div><small>square delete+cancel</small><span><ArButton tone="danger" icon="x" label="削除" /></span></div>
  <div><small>square add rotate</small><span><ArButton tone="primary" icon="undo" label="回転" /></span></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; width: 150px; }
.g > .w { width: 220px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
