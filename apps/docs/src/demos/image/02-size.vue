<!-- 大きさ・収め方・代わりの画像 | width・height で大きさ。fit="contain" は全体を入れる。fallback は読み込めないときの代わりの画像。preview=false で押せない画像に。 -->
<script setup lang="ts">
import { ArCluster, ArImage } from "@arrow/ui";
const pic = (w: number, h: number, a: string, b: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) / 4}" fill="#fff" opacity=".5"/></svg>`,
  );
const tall = pic(300, 600, "#DCEFE7", "#4EB187");
</script>

<template>
<ArCluster :gap="3" wrap="wrap" align="end">
  <ArImage :src="tall" alt="名札（切り取って埋める）" :width="80" :height="80" />
  <ArImage :src="tall" alt="名札（全体を入れる）" :width="80" :height="80" fit="contain" />
  <ArImage :src="tall" alt="縦長の書類" :width="120" :height="160" />
  <ArImage src="/broken.png" :fallback="pic(300, 200, '#F6EECC', '#D1AA00')" alt="代わりの画像" />
  <ArImage :src="pic(300, 200, '#F9E7F1', '#E389B7')" alt="押せない画像" :preview="false" />
</ArCluster>
</template>
