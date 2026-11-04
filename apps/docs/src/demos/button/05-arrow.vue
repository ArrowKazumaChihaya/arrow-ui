<!-- 今の ARROW の種類 | 今の ARROW の Button の type との対応：add→primary、edit→edit、delete→danger、lock など→dark、cancel→secondary、info→subtle、bordered→dashed、text→ghost、transround→overlay。今の ARROW と同じく幅150pxの入れ物に block で入れている。 -->
<script setup lang="ts">
import { ArButton } from "@s_and_a/arrow-ui";
</script>

<template>
<div class="g">
  <div><small>add</small><ArButton tone="primary" block>登録</ArButton></div>
  <div><small>edit</small><ArButton tone="edit" block>編集</ArButton></div>
  <div><small>delete</small><ArButton tone="danger" block>削除</ArButton></div>
  <div><small>lock</small><ArButton tone="dark" block>ロック</ArButton></div>
  <div><small>cancel</small><ArButton tone="secondary" block>キャンセル</ArButton></div>
  <div><small>info</small><ArButton tone="subtle" block>詳細</ArButton></div>
  <div><small>bordered</small><span><ArButton tone="dashed">追加する</ArButton></span></div>
  <div><small>text</small><span><ArButton tone="ghost">リンク</ArButton></span></div>
  <div><small>transround</small><span><ArButton tone="overlay" icon="camera" label="写真を変える" /></span></div>
  <div><small>unlock</small><ArButton tone="dark" block>解除</ArButton></div>
  <div><small>movie</small><ArButton tone="dark" block>動画</ArButton></div>
  <div><small>(none)</small><ArButton tone="dark" block>既定</ArButton></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; width: 150px; }
small { font: 10px ui-monospace, monospace; color: #999; }
</style>
