<!-- 切り替え | 2〜4つの表示の切り替え。地は淡い灰色、選んでいるものは白い面にテーマ色の文字。count で文字の右に件数の丸（「備考 2」）。←→ で選び直せる。 -->
<script setup lang="ts">
import { ArSegmented, ArStack } from "@arrow/ui";
import { ref } from "vue";
const a = ref("new");
const b = ref("time");
</script>

<template>
<ArStack :gap="4" align="start">
  <ArSegmented v-model="a" label="募集" :options="[{ value: 'new', label: '新しく募集' }, { value: 'status', label: '提出状況' }]" />
  <ArSegmented v-model="b" label="表示モード" :options="[{ value: 'time', label: '時間帯' }, { value: 'note', label: '備考', count: 2 }, { value: 'chart', label: 'チャート' }]" />
</ArStack>
</template>
