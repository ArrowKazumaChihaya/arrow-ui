<!-- 目次 | 長いフォーム（社員情報など）の目次。押すとその場所へスクロールし、今いるところはテーマ色の線と文字。container でスクロールする箱を渡す。 -->
<script setup lang="ts">
import { ArAnchor, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const cur = ref("basic");
const items = [
  { key: "basic", href: "#anc-basic", label: "基本情報" },
  { key: "contract", href: "#anc-contract", label: "雇用契約" },
  { key: "salary", href: "#anc-salary", label: "給与の計算", level: 2 as const },
  { key: "family", href: "#anc-family", label: "家族" },
  { key: "mynumber", href: "#anc-mynumber", label: "マイナンバー" },
];
const h = ref("basic");
</script>

<template>
<ArCluster :gap="6" align="start">
  <div style="width: 180px"><ArAnchor v-model="cur" :items="items" container="#anc-box" /></div>
  <div id="anc-box" style="height: 200px; width: 320px; overflow: auto; border-radius: 12px; box-shadow: inset 0 0 0 1px #E6EBF0; padding: 0 14px; font-size: 13px; color: #4A5562">
    <section v-for="it in items" :id="it.href.slice(1)" :key="it.key" style="padding: 12px 0 60px"><b style="color: #1F2933">{{ it.label }}</b><br>ここに項目が並ぶ…</section>
  </div>
  <ArAnchor v-model="h" :items="items.filter((i) => i.key !== 'salary').slice(0, 3)" direction="horizontal" container="#anc-box" />
</ArCluster>
</template>
