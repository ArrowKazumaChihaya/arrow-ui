<!-- ページの画像・1ページだけ | pages に製品が PDF から作った画像を渡す（ここでは SVG の画像）。1ページなら classic は「‹ 1 / 1 ›」を出さない。src を渡すとブラウザの PDF 表示を iframe で出す（#page と #zoom を付ける）。 -->
<script setup lang="ts">
import { ArPdfViewer, ArStack } from "@s_and_a/arrow-ui";
const pageImg = (n: number, title: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="792" viewBox="0 0 560 792"><rect width="560" height="792" fill="#fff"/><text x="280" y="80" font-size="22" text-anchor="middle" font-family="serif" letter-spacing="4">${title}</text>${Array.from({ length: 14 }, (_, i) => `<rect x="60" y="${130 + i * 40}" width="${440 - (i % 3) * 60}" height="10" rx="2" fill="#E3E7EB"/>`).join("")}<text x="500" y="760" font-size="12" text-anchor="end" fill="#888">${n} / 3</text></svg>`,
  );
const pages = [1, 2, 3].map((n) => ({ src: pageImg(n, "源泉徴収票"), alt: `源泉徴収票 ${n}ページ目` }));
const one = [{ src: pageImg(1, "退職証明書"), alt: "退職証明書" }];
</script>

<template>
<ArStack :gap="5" style="max-width: 760px">
  <ArPdfViewer :pages="pages" label="源泉徴収票" height="460px" :zoom-steps="[50, 70, 100]" :labels="{ person: '' }" />
  <ArPdfViewer :pages="one" label="退職証明書" height="420px" />
</ArStack>
</template>
