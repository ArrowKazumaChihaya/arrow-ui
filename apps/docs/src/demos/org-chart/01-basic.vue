<!-- 部署/店舗階層構造 | いちばん上の部署が横に並び、子の店舗が線でつながる。札を押すと select（その部署/店舗の情報を開く）。子のある札の下の丸で開け閉め、右下で拡大縮小・全体を表示、地をドラッグで動かす・ホイールで拡大縮小。 -->
<script setup lang="ts">
import { ArOrgChart, type ArOrgNode } from "@arrow/ui";
import { ref } from "vue";
const nodes: ArOrgNode[] = [
  { key: "1", label: "ARROW事業部", code: "arrow", count: 8, children: [{ key: "5", label: "渋谷店", code: "shibuya", count: 12 }, { key: "6", label: "新宿店", code: "shinjuku", count: 9 }] },
  { key: "2", label: "ADVANCE事業部", code: "advance", count: 6 },
  { key: "3", label: "GOODY事業部", code: "goody", count: 5 },
  { key: "4", label: "その他事業部", code: "other", count: 2 },
];
const picked = ref<string | null>(null);
const zoom = ref(1);
</script>

<template>
<div style="display: flex; flex-direction: column; gap: 8px">
  <ArOrgChart v-model:zoom="zoom" :nodes="nodes" :selected="picked" label="部署/店舗階層構造" height="420px" @select="(n) => (picked = n.key)" />
  <div style="font-size: 13px">選んだ部署/店舗：{{ nodes.flatMap((n) => [n, ...(n.children ?? [])]).find((n) => n.key === picked)?.label ?? "（まだ）" }}</div>
</div>
</template>
