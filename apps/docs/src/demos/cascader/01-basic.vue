<!-- 店舗・部署の階層 | 段ごとの列で選ぶ。選んだ道筋は淡いテーマ色、最後の段はチェック。閉店した店舗は disabled。→ ← で段を移る。 -->
<script setup lang="ts">
import { ArCascader, ArStack } from "@arrow/ui";
import { ref } from "vue";
const store = ref<(string | number)[] | null>(["arrow", "tokyo", "shibuya"]);
const dept = ref<(string | number)[] | null>(null);
const stores = [
  {
    value: "arrow",
    label: "ARROW事業部",
    children: [
      { value: "tokyo", label: "東京", children: [{ value: "shibuya", label: "渋谷店" }, { value: "shinjuku", label: "新宿店" }, { value: "ikebukuro", label: "池袋店（閉店）", disabled: true }] },
      { value: "osaka", label: "大阪", children: [{ value: "umeda", label: "梅田店" }, { value: "namba", label: "難波店" }] },
    ],
  },
  { value: "hq", label: "本社", children: [{ value: "sales", label: "営業部" }, { value: "admin", label: "管理部" }] },
];
</script>

<template>
<ArStack :gap="3" align="start">
  <ArCascader v-model="store" :options="stores" variant="selbox" icon="store" label="店舗" style="width: 280px" />
  <ArCascader v-model="dept" :options="stores" placeholder="部署を選ぶ" clearable label="部署" style="width: 280px" />
</ArStack>
</template>
