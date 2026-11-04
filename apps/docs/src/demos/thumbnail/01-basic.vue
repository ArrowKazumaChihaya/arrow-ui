<!-- 顔写真 | 丸と四角、写真のあるとき・ないとき。右下のカメラで、選ぶ・動かす・拡大縮小・回すの切り抜きを開く。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArThumbnail, ArCluster } from "@s_and_a/arrow-ui";
const face = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22300%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23BBD3EB%22/%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%235591CE%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%22300%22%20height%3D%22300%22%20fill%3D%22url%28%23g%29%22/%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%22120%22%20r%3D%2256%22%20fill%3D%22%23F4D9C6%22/%3E%3Cpath%20d%3D%22M52%20300c8-62%2048-96%2098-96s90%2034%2098%2096z%22%20fill%3D%22%232C6AA6%22/%3E%3Cpath%20d%3D%22M94%20112c0-40%2026-64%2056-64s56%2024%2056%2064c-10-20-30-30-56-30s-46%2010-56%2030z%22%20fill%3D%22%233B2F2A%22/%3E%3C/svg%3E";
const a = ref<string | null>(face);
const b = ref<string | null>(null);
const c = ref<string | null>(face);
const d = ref<string | null>(null);
</script>

<template>
<ArCluster :gap="6" align="end">
  <ArThumbnail v-model="a" shape="circle" alt="千速 一真さんの写真" :quality="2" fit="cover" />
  <ArThumbnail v-model="b" shape="circle" />
  <ArThumbnail v-model="c" :size="100" alt="写真" />
  <ArThumbnail v-model="d" :size="100" :crop-width="300" :crop-height="400" />
  <ArThumbnail :model-value="face" :size="56" shape="circle" :editable="false" alt="小さな写真" />
</ArCluster>
</template>
