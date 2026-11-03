<!-- 大きさと状態 | sm（30）・md（38）・lg（44）。間違い・使えない・読み込み中（右の印が回る）・選択肢が空。 -->
<script setup lang="ts">
import { ArSelect, ArCluster, ArStack } from "@arrow/ui";
import { ref } from "vue";
const v = ref<string | number | null>(2);
const none = ref<string | number | null>(null);
const options = [
  { value: 1, label: "日" },
  { value: 2, label: "週" },
  { value: 3, label: "月" },
];
</script>

<template>
<ArStack :gap="4">
  <ArCluster :gap="2" align="center">
    <ArSelect v-model="v" :options="options" size="sm" label="小" style="width: 140px" />
    <ArSelect v-model="v" :options="options" label="ふつう" style="width: 140px" />
    <ArSelect v-model="v" :options="options" size="lg" label="大" style="width: 140px" />
  </ArCluster>
  <ArCluster :gap="2" align="center">
    <ArSelect v-model="none" :options="options" invalid placeholder="間違い" label="間違い" style="width: 140px" />
    <ArSelect v-model="v" :options="options" disabled label="使えない" style="width: 140px" />
    <ArSelect v-model="none" :options="[]" loading placeholder="読み込み中" label="読み込み中" style="width: 140px" />
    <ArSelect v-model="none" :options="[]" placeholder="空のとき" empty-text="店舗がまだありません" label="空" style="width: 140px" />
  </ArCluster>
</ArStack>
</template>
