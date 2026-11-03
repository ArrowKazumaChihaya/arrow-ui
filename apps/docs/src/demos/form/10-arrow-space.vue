<!-- 今の ARROW の使い方：並べる（Space） | 今の ARROW の Space（antd の Space：間8px）は、横は ArCluster・縦は ArStack の gap=2（8px）。ボタンは今と同じく幅90px。 -->
<script setup lang="ts">
import { ArCluster, ArStack, ArButton, ArTextInput } from "@arrow/ui";
import { ref } from "vue";
const a = ref("1行目");
const b = ref("2行目");
</script>

<template>
<div class="g">
  <div><small>horizontal</small>
    <ArCluster :gap="2" :wrap="false">
      <ArButton tone="primary" style="width: 90px">追加</ArButton>
      <ArButton tone="secondary" style="width: 90px">戻る</ArButton>
    </ArCluster>
  </div>
  <div><small>vertical</small>
    <ArStack :gap="2">
      <ArTextInput v-model="a" label="1行目" style="width: 200px" />
      <ArTextInput v-model="b" label="2行目" style="width: 200px" />
    </ArStack>
  </div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
