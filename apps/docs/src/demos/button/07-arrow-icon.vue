<!-- 今の ARROW の種類：アイコン | アイコンは文字の前（classic は今の ARROW のアイコンの形）。blink は文字とアイコンを1秒ごとに点滅させる。 -->
<script setup lang="ts">
import { ArButton } from "@arrow/ui";
</script>

<template>
<div class="g">
  <div><small>add+plus</small><ArButton tone="primary" icon="plus" block>追加</ArButton></div>
  <div><small>add+exec</small><ArButton tone="primary" icon="check" block>実行</ArButton></div>
  <div><small>add+pointer (操作)</small><ArButton tone="primary" icon="hand" block>操作</ArButton></div>
  <div><small>edit+edit</small><ArButton tone="edit" icon="pen" block>編集</ArButton></div>
  <div><small>delete+cancel</small><ArButton tone="danger" icon="x" block>削除</ArButton></div>
  <div><small>lock+lock</small><ArButton tone="dark" icon="lock" block>ロック</ArButton></div>
  <div><small>lock+unlock</small><ArButton tone="dark" icon="unlock" block>ロック解除</ArButton></div>
  <div><small>add+excel</small><ArButton tone="primary" icon="xls" block>Excel出力</ArButton></div>
  <div><small>bordered+plus</small><span><ArButton tone="dashed" icon="plus">シフトを追加</ArButton></span></div>
  <div><small>bordered+minus</small><span><ArButton tone="dashed" icon="minus">閉じる</ArButton></span></div>
  <div><small>text+edit</small><span><ArButton tone="ghost" icon="pen">編集する</ArButton></span></div>
  <div><small>info+document</small><ArButton tone="subtle" icon="file" block>帳票</ArButton></div>
  <div><small>cancel+reload</small><ArButton tone="secondary" icon="reload" block>再読込</ArButton></div>
  <div><small>add (blink)</small><ArButton tone="primary" block blink>点滅</ArButton></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; width: 150px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
