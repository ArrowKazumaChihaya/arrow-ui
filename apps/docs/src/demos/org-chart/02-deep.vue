<!-- 深い階層・たくさんの店舗 | エリア → 店舗 → 売り場のように何段でも描ける。初めは全体が入る大きさにする（「全体を表示」と同じ）。人数の文字は countLabel で変えられる（「直属 0人」）。expanded で開いている札を持てる。 -->
<script setup lang="ts">
import { ArOrgChart, type ArOrgNode } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const shops = (area: string, names: string[]): ArOrgNode[] =>
  names.map((n, i) => ({ key: `${area}-${i}`, label: n, code: `${area}-${String(i + 1).padStart(2, "0")}`, count: 6 + ((i * 5) % 11), children: i === 0 ? [{ key: `${area}-${i}-a`, label: `${n} 売り場A`, code: `${area}-a`, count: 3 }, { key: `${area}-${i}-b`, label: `${n} 売り場B`, code: `${area}-b`, count: 2 }] : undefined }));
const nodes: ArOrgNode[] = [
  { key: "east", label: "東日本エリア", code: "east", countLabel: "直属 0人", children: shops("east", ["池袋店", "上野店", "品川店", "吉祥寺店", "立川店"]) },
  { key: "west", label: "西日本エリア", code: "west", countLabel: "直属 0人", children: shops("west", ["梅田店", "難波店", "京都店", "博多店"]) },
];
const open = ref<string[]>(["east", "west", "east-0"]);
</script>

<template>
<ArOrgChart v-model:expanded="open" :nodes="nodes" label="エリアと店舗" height="460px" />
</template>
