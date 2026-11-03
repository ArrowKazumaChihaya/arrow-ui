<!-- 店舗の選択（selbox） | variant="selbox" はアイコン＋名前＋下向きの印。シフト画面の「店舗」と同じ形。選択肢が7つ以上なので探す欄が出る。 -->
<script setup lang="ts">
import { ArSelect, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const store = ref<string | number | null>("all");
const stores = [
  { value: "all", label: "ARROW事業部" },
  { label: "東京", options: [{ value: "shibuya", label: "渋谷店", keywords: "しぶや" }, { value: "shinjuku", label: "新宿店", keywords: "しんじゅく" }, { value: "ikebukuro", label: "池袋店", keywords: "いけぶくろ" }] },
  { label: "大阪", options: [{ value: "umeda", label: "梅田店", keywords: "うめだ" }, { value: "namba", label: "難波店（閉店）", disabled: true }] },
  { label: "名古屋", options: [{ value: "sakae", label: "栄店", keywords: "さかえ" }, { value: "meieki", label: "名駅店", keywords: "めいえき" }] },
];
</script>

<template>
<ArCluster :gap="3" align="center" wrap="wrap">
  <span style="font-size: 12.5px; font-weight: 600; color: #66727f">店舗</span>
  <ArSelect v-model="store" :options="stores" variant="selbox" icon="store" label="店舗" />
  <ArSelect v-model="store" :options="stores" variant="selbox" icon="store" size="sm" label="店舗（小）" />
  <ArSelect v-model="store" :options="stores" variant="selbox" icon="store" disabled label="店舗（使えない）" />
</ArCluster>
</template>
