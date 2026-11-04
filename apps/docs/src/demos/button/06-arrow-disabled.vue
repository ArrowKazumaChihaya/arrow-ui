<!-- 今の ARROW の種類：押せない | 塗りの種類は灰色になり、secondary（cancel）・subtle（info）は見た目が変わらない。disabled-reason を渡すと、押せない見た目のまま押せて、押すと理由のダイアログを出す。 -->
<script setup lang="ts">
import { ArButton } from "@s_and_a/arrow-ui";
</script>

<template>
<div class="g">
  <div><small>add disabled</small><ArButton tone="primary" block disabled>登録</ArButton></div>
  <div><small>edit disabled</small><ArButton tone="edit" block disabled>編集</ArButton></div>
  <div><small>delete disabled</small><ArButton tone="danger" block disabled>削除</ArButton></div>
  <div><small>lock disabled</small><ArButton tone="dark" block disabled>ロック</ArButton></div>
  <div><small>cancel disabled</small><ArButton tone="secondary" block disabled>キャンセル</ArButton></div>
  <div><small>info disabled</small><ArButton tone="subtle" block disabled>詳細</ArButton></div>
  <div><small>bordered disabled</small><span><ArButton tone="dashed" disabled>追加する</ArButton></span></div>
  <div><small>text disabled</small><span><ArButton tone="ghost" disabled>リンク</ArButton></span></div>
  <div><small>transround disabled</small><span><ArButton tone="overlay" icon="camera" label="写真を変える" disabled /></span></div>
  <div><small>unlock disabled</small><ArButton tone="dark" block disabled>解除</ArButton></div>
  <div><small>movie disabled</small><ArButton tone="dark" block disabled>動画</ArButton></div>
  <div><small>(none) disabled</small><ArButton tone="dark" block disabled>既定</ArButton></div>
  <div><small>delete disabled (reason)</small><ArButton tone="danger" block disabled disabled-reason="締め済みのため削除できません">削除</ArButton></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; width: 150px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
