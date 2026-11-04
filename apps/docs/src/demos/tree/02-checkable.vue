<!-- チェック | checkable で名前の前に ArCheckbox。親を付けると子もすべて付き、一部だけなら「一部」の印。Space で付け外し。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArTree, type ArTreeKey } from "@s_and_a/arrow-ui";
const checked = ref<ArTreeKey[]>(["shibuya"]);
const items = [
  {
    key: "tokyo",
    label: "東京",
    icon: "folder" as const,
    children: [
      { key: "shibuya", label: "渋谷店", icon: "store" as const },
      { key: "shinjuku", label: "新宿店", icon: "store" as const },
      { key: "ikebukuro", label: "池袋店（閉店）", icon: "store" as const, disabled: true },
    ],
  },
  { key: "osaka", label: "大阪", icon: "folder" as const, children: [{ key: "umeda", label: "梅田店", icon: "store" as const }, { key: "namba", label: "難波店", icon: "store" as const }] },
];
</script>

<template>
<div style="width: 280px">
  <ArTree v-model:checked="checked" :items="items" checkable :selectable="false" default-expand-all label="対象の店舗" />
  <p style="margin: 8px 0 0; font-size: 12px; color: var(--ar-color-text-muted)">チェック：{{ checked.join("、") || "なし" }}</p>
</div>
</template>
