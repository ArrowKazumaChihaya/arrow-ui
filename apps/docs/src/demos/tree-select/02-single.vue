<!-- 1つ選ぶ・探す | チェックなしで1つ選ぶ。選んだ行は淡いテーマ色。leaf-only で親を選べなくする。searchable で探す欄（合う部署とその親だけ出る）。 -->
<script setup lang="ts">
import { ArTreeSelect, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const a = ref<string | number | null>("tokyo");
const b = ref<string | number | null>(null);
const tree = [
  { value: "sales", label: "営業部", children: [{ value: "tokyo", label: "東京営業所" }, { value: "osaka", label: "大阪営業所" }] },
  { value: "admin", label: "管理部", children: [{ value: "hr", label: "人事課" }, { value: "acc", label: "経理課" }] },
];
</script>

<template>
<ArCluster :gap="3" align="center" wrap>
  <ArTreeSelect v-model="a" :tree="tree" label="部署" style="width: 240px" />
  <ArTreeSelect v-model="b" :tree="tree" leaf-only searchable placeholder="課・営業所を選ぶ" label="課" style="width: 240px" />
  <ArTreeSelect v-model="a" :tree="tree" size="sm" label="小" style="width: 200px" />
  <ArTreeSelect v-model="a" :tree="tree" disabled label="使えない" style="width: 200px" />
</ArCluster>
</template>
