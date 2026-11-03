<!-- 見本の枠（合意書類の書類詳細） | :toolbar="false" で上の段を消すと、灰色の地に白い紙を置いた枠だけ。紙の中は page slot。 -->
<script setup lang="ts">
import { ArPdfViewer } from "@arrow/ui";
const th = "border: 1px solid #888; background: #D1D5D8; padding: 5px 7px; width: 80px; text-align: center; font-weight: 400; white-space: nowrap";
const td = "border: 1px solid #888; padding: 5px 7px";
</script>

<template>
<ArPdfViewer :toolbar="false" label="雇用契約書の見本">
  <template #page>
    <div style="padding: 40px 44px; font: 11.5px/1.6 'Noto Serif JP', 'Hiragino Mincho ProN', serif">
      <h1 style="text-align: center; font-size: 20px; margin: 0 0 16px; letter-spacing: .2em">雇用契約書</h1>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px">
        <tbody>
          <tr><th :style="th">フリガナ<br>氏名</th><td :style="td">コヤマ ユイ<br>小山 結衣</td><th :style="th">生年月日</th><td :style="td">平成12年5月3日</td></tr>
          <tr><th :style="th">現住所</th><td :style="td" colspan="3">〒160-0022 東京都新宿区新宿3-1-1</td></tr>
        </tbody>
      </table>
      <p style="margin: 8px 0">以下の条件により雇用契約を締結する。</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px">
        <tbody>
          <tr><th :style="th">雇用期間</th><td :style="td">令和8年11月1日〜令和9年3月31日</td></tr>
          <tr><th :style="th">就業場所</th><td :style="td">ARROW株式会社 新宿店</td></tr>
          <tr><th :style="th">賃金</th><td :style="td">時給 1,200円　締め日：末日　支払日：翌月25日</td></tr>
        </tbody>
      </table>
      <p style="margin: 18px 0 4px">令和8年10月20日</p>
      <p style="margin: 0">（甲）東京都千代田区丸の内1-1-1　ARROW株式会社　代表取締役 末永 修也</p>
      <p style="margin: 6px 0 0">（乙）署名：（合意後に表示）</p>
    </div>
  </template>
</ArPdfViewer>
</template>
