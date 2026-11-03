<!-- 足の補足・大きさ | footer-note で足の左に補足（概算の説明など）。#footer で右のボタンを自由に並べる。size は sm 420・md 640・lg 880・xl 1100・full、width で数でも決められる。 -->
<script setup lang="ts">
import { ArModal, ArButton, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const open = ref(false);
const size = ref<"sm" | "md" | "lg" | "xl" | "full">("lg");
function show(s: typeof size.value) {
  size.value = s;
  open.value = true;
}
</script>

<template>
<ArCluster :gap="2">
  <ArButton v-for="s in ['sm', 'md', 'lg', 'xl', 'full'] as const" :key="s" @click="show(s)">{{ s }}</ArButton>
</ArCluster>
<ArModal
  v-model:open="open"
  :size="size"
  title="日毎人件費"
  description="日ごとの人件費（概算）を一覧で確認し、CSVで書き出せます。"
  footer-note="時給・月給の設定から計算した概算です。実績は打刻がある日だけ出ます。"
>
  <p style="margin: 0">size="{{ size }}" の中身。</p>
  <template #footer>
    <ArButton @click="open = false">閉じる</ArButton>
    <ArButton tone="primary" icon="dl" @click="open = false">CSVで出力</ArButton>
  </template>
</ArModal>
</template>
