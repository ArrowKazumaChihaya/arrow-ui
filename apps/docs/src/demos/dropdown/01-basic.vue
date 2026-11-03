<!-- ドロップダウン | シフトの「操作」メニューと同じ形。項目にアイコン・区切り・権限なし（鍵と灰色）・危ない項目（赤・区切り線のあと）。split は Dropdown.Button（Compact でつなぐ）。 -->
<script setup lang="ts">
import { ArDropdown, ArCluster, type ArMenuItem } from "@arrow/ui";
import { ref } from "vue";
const last = ref("");
const items: ArMenuItem[] = [
  { key: "recruit", label: "シフト募集", icon: "mega" },
  { key: "bulk", label: "シフト一括登録", icon: "layers" },
  { key: "hr", type: "divider" },
  { key: "pub", label: "公開期間設定（権限なし）", locked: true },
  { key: "del", label: "シフト一括削除", icon: "trash", danger: true },
];
const saves: ArMenuItem[] = [{ key: "draft", label: "下書きとして保存", icon: "note" }, { key: "copy", label: "複製して保存", icon: "copy" }];
</script>

<template>
<ArCluster :gap="5" align="start">
  <ArDropdown :items="items" variant="ops" icon="hand" label="操作" :width="250" @select="last = $event" />
  <ArDropdown :items="items" label="その他" tone="secondary" @select="last = $event" />
  <ArDropdown :items="saves" variant="split" tone="primary" label="保存" more-label="ほかの保存" @click="last = 'save'" @select="last = $event" />
  <ArDropdown :items="items" label="使えない" disabled />
  <span style="font-size: 12.5px; color: #66727F">選んだもの：{{ last || "—" }}</span>
</ArCluster>
</template>
