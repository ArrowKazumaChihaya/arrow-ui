<!-- 基本 | 店舗・部署の階層。押すと選び（淡いテーマ色）、∨ で開け閉め。↑↓ で移り、→ で開く、← で閉じる・親へ、Enter で選ぶ、文字で飛ぶ。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArTree, type ArTreeKey } from "@s_and_a/arrow-ui";
const selected = ref<ArTreeKey | null>("shibuya");
const expanded = ref<ArTreeKey[]>(["arrow", "tokyo"]);
const items = [
  {
    key: "arrow",
    label: "ARROW事業部",
    icon: "folder" as const,
    children: [
      { key: "tokyo", label: "東京", icon: "folder" as const, children: [{ key: "shibuya", label: "渋谷店", icon: "store" as const }, { key: "shinjuku", label: "新宿店", icon: "store" as const }] },
      { key: "osaka", label: "大阪", icon: "folder" as const, children: [{ key: "umeda", label: "梅田店", icon: "store" as const }] },
    ],
  },
  { key: "hq", label: "本社", icon: "folder" as const },
];
</script>

<template>
<div style="width: 260px">
  <ArTree v-model="selected" v-model:expanded="expanded" :items="items" label="店舗" />
</div>
</template>
