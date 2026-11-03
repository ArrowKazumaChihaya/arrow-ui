<!-- 基本 | 角丸12。乗せる・フォーカスで暗い幕に「プレビュー」、押すと大きく見る。読み込めないときは灰色の箱。 -->
<script setup lang="ts">
import { ArCluster, ArImage } from "@arrow/ui";
// 見本の画像（テーマ色のグラデーション）。実際には写真の URL を渡す。
const pic = (a: string, b: string, c: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".6" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/></svg>`,
  );
const shop = pic("#DDE9F5", "#7AA9D9", "#5591CE");
const room = pic("#BBD3EB", "#5591CE", "#2C6AA6");
</script>

<template>
<ArCluster :gap="3">
  <ArImage :src="shop" alt="渋谷店の外観" />
  <ArImage :src="room" alt="休憩室" />
  <ArImage src="/no-such-image.png" alt="新宿店の外観" :width="100" />
</ArCluster>
</template>
