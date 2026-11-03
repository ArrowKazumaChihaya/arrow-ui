<!-- 途中の段も選ぶ・乗せて開く・最後だけ出す | change-on-select で「東京」なども選べる。expand-trigger="hover" で乗せただけで次の段が開く。display-last で最後の段の名前だけ出す。 -->
<script setup lang="ts">
import { ArCascader, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const a = ref<(string | number)[] | null>(["arrow", "tokyo"]);
const b = ref<(string | number)[] | null>(["arrow", "osaka", "umeda"]);
const stores = [
  {
    value: "arrow",
    label: "ARROW事業部",
    children: [
      { value: "tokyo", label: "東京", children: [{ value: "shibuya", label: "渋谷店" }, { value: "shinjuku", label: "新宿店" }] },
      { value: "osaka", label: "大阪", children: [{ value: "umeda", label: "梅田店" }] },
    ],
  },
];
</script>

<template>
<ArCluster :gap="3" align="center" wrap>
  <ArCascader v-model="a" :options="stores" change-on-select expand-trigger="hover" label="地域" style="width: 240px" />
  <ArCascader v-model="b" :options="stores" display-last variant="selbox" icon="store" label="店舗（最後だけ）" />
  <ArCascader v-model="b" :options="stores" size="sm" label="小" style="width: 220px" />
  <ArCascader v-model="b" :options="stores" disabled label="使えない" style="width: 220px" />
</ArCluster>
</template>
