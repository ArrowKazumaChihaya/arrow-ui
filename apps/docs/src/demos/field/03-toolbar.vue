<!-- ラベルを左に小さく（toolbar） | layout="toolbar"：カードの頭の絞り込みのように、小さな灰色のラベルを入力の左に添える（幅は文字なり）。シフト画面の「店舗」「表示モード」。 -->
<script setup lang="ts">
import { ArCluster, ArField, ArSegmented, ArSelect } from "@arrow/ui";
import { ref } from "vue";
const store = ref<string | number | null>("arrow");
const mode = ref("time");
</script>

<template>
<ArCluster :gap="6" align="center">
  <ArField label="店舗" layout="toolbar" v-slot="f">
    <ArSelect v-bind="f" v-model="store" :options="[{ value: 'arrow', label: 'ARROW事業部' }, { value: 'shibuya', label: '渋谷店' }]" variant="selbox" icon="store" />
  </ArField>
  <ArField label="表示モード" layout="toolbar">
    <ArSegmented v-model="mode" label="表示モード" :options="[{ value: 'time', label: '時間帯' }, { value: 'note', label: '備考' }]" />
  </ArField>
</ArCluster>
</template>
