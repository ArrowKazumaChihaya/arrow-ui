<!-- ロゴの読み込み中 | ロゴの絵は製品が slot（SVG）で渡す。回す輪に data-logo="ring"、矢に data-logo="mark" を付ける。spin（既定）は輪が回って矢が刺さり直す、circle は輪だけ回る、blink は全体が点滅する。src に画像を渡すと blink だけ。動きを減らす設定の人には動かさない。 -->
<script setup lang="ts">
import { ArLogoSpin } from "@arrow/ui";
const RING = "M464.4,662.4c5.4,37-5.9,75.9-34.3,104.3c-47.6,47.7-125.2,47.7-172.8,0c-47.6-47.6-47.6-125.2,0-172.8c28.4-28.4,67.4-39.7,104.3-34.3l117-117c-104.3-59.2-239.4-44.4-328.2,44.4c-106.6,106.6-106.6,280,0,386.6s280,106.6,386.6,0c88.8-88.8,103.5-223.9,44.4-328.2L464.4,662.4z";
const MARK = "M939.9,231.1l-147.1,0.1l0.1-147.1L613,264l0.1,93.5L317,653.6c-14.8,14.8-14.8,38.7,0,53.4c14.7,14.8,38.7,14.8,53.4,0l296.1-296.1H760L939.9,231.1z";
const src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="#DC2525" d="${RING}"/><path fill="#3E3A39" d="${MARK}"/></svg>`)}`;
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 32px; align-items: center">
    <div><small style="display: block; margin-bottom: 6px; color: #999; font: 10px monospace">spin</small>
      <ArLogoSpin><svg viewBox="0 0 1024 1024"><path data-logo="ring" fill="#DC2525" :d="RING" /><path data-logo="mark" fill="#3E3A39" :d="MARK" /></svg></ArLogoSpin></div>
    <div><small style="display: block; margin-bottom: 6px; color: #999; font: 10px monospace">circle</small>
      <ArLogoSpin motion="circle"><svg viewBox="0 0 1024 1024"><path data-logo="ring" fill="#DC2525" :d="RING" /></svg></ArLogoSpin></div>
    <div><small style="display: block; margin-bottom: 6px; color: #999; font: 10px monospace">blink（src）</small>
      <ArLogoSpin motion="blink" :src="src" label="ページを読み込み中" /></div>
  </div>
</template>
