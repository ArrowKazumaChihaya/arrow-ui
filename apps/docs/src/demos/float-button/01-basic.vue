<!-- 浮かぶボタン・グループ | 主なものだけテーマ色（tone="primary"）。件数は赤の丸。items を渡すと縦につないだグループ。fixed で画面の右下に固定する（スマホの「シフト追加」）。 -->
<script setup lang="ts">
import { ArFloatButton, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const last = ref("");
</script>

<template>
<ArCluster :gap="5" align="center">
  <ArFloatButton tone="primary" icon="plus" label="シフト追加" />
  <ArFloatButton icon="help" label="ヘルプ" :badge="3" />
  <ArFloatButton
    label="ほかの操作"
    :items="[{ key: 'top', icon: 'up', label: '上へ' }, { key: 'note', icon: 'note', label: 'メモ' }, { key: 'mail', icon: 'mail', label: '問い合わせ', badge: 2 }]"
    @select="last = $event"
  />
  <span style="font-size: 12.5px; color: #66727F">押したもの：{{ last || "—" }}</span>
</ArCluster>
</template>
