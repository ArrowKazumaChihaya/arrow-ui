<!-- 製品の地図を敷く | default slot に Google マップの埋め込みや静止画像を渡すと、見本の地の代わりにそれを敷き、ピンと円を重ねる。縮尺が分かるなら radius-px で円の直径を渡す。 -->
<script setup lang="ts">
import { ArMapPreview } from "@s_and_a/arrow-ui";
</script>

<template>
<ArMapPreview :radius="300" :radius-px="160" address="東京都千代田区丸の内1-1-1">
  <div style="position: absolute; inset: 0; background: repeating-linear-gradient(0deg, #DDE6EE 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, #DDE6EE 0 1px, #F4F7FA 1px 40px)" />
</ArMapPreview>
</template>
