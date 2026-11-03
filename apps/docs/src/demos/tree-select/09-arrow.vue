<!-- 今の ARROW の使い方 | 今の ARROW の TreeSelect と同じ：店舗・部署の木から1つ選ぶ（ツリーの線つき、すべて開いた状態で開く）。幅は画面ごと（ここでは 240px）。 -->
<script setup lang="ts">
import { ArTreeSelect } from "@arrow/ui";
import { ref } from "vue";
const tree = [
  { value: "hq", label: "本社", children: [{ value: "sales", label: "営業部" }, { value: "admin", label: "総務部" }] },
  { value: "shibuya", label: "渋谷店", children: [{ value: "hall", label: "ホール" }, { value: "kitchen", label: "キッチン" }] },
  { value: "shinjuku", label: "新宿店" },
];
const a = ref<string | null>(null);
const b = ref<string | null>("sales");
</script>

<template>
<div class="g">
  <div><small>placeholder</small><ArTreeSelect v-model="a" :tree="tree" :show-path="false" default-expand-all placeholder="未選択" label="部署" style="width: 240px" /></div>
  <div><small>selected</small><ArTreeSelect v-model="b" :tree="tree" :show-path="false" default-expand-all placeholder="未選択" label="部署" style="width: 240px" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 40px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
