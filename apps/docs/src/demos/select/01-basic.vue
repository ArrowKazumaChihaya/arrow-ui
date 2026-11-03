<!-- 選ぶ（まとまり付き） | options は値と表示のならび。label を付けたまとまりにもできる。 -->
<script setup lang="ts">
import { ArSelect, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const store = ref<string | number | null>(1);
const none = ref<string | number | null>(null);
const stores = [
  { label: "東京", options: [{ value: 1, label: "渋谷店" }, { value: 2, label: "新宿店" }] },
  { label: "大阪", options: [{ value: 3, label: "梅田店" }] },
];
</script>

<template>
<ArCluster :gap="3">
  <ArSelect v-model="store" :options="stores" label="店舗" />
  <ArSelect v-model="none" :options="stores" placeholder="選んでください" label="店舗（未選択）" />
  <ArSelect v-model="store" :options="stores" size="sm" label="小" />
  <ArSelect v-model="store" :options="stores" disabled label="押せない" />
</ArCluster>
</template>
