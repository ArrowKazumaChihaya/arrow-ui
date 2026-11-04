<!-- 分割パネル | つまみをドラッグして幅を変え、ダブルクリック（または Enter）で元に戻す。キーボードは ←→、Shift で大きく動く。 -->
<script setup lang="ts">
import { ArSplitter, ArStack } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const w = ref<number>();
const h = ref<number>();
</script>

<template>
<ArStack :gap="4">
  <div style="height: 150px; max-width: 628px">
    <ArSplitter v-model:size="w" default-size="40%" :min="160" :end-min="160" bordered label="カレンダーの幅" style="height: 100%">
      <template #start><b style="color: #1F2933">カレンダー</b><br>左のパネル（最小 160px）<br>{{ w ? `${w}px` : "40%" }}</template>
      <template #end><b style="color: #1F2933">シフト詳細</b><br>右のパネル</template>
    </ArSplitter>
  </div>
  <div style="height: 200px; max-width: 628px">
    <ArSplitter v-model:size="h" orientation="vertical" :default-size="80" :min="40" :end-min="40" bordered label="上のパネルの高さ" style="height: 100%">
      <template #start>上のパネル</template>
      <template #end>下のパネル</template>
    </ArSplitter>
  </div>
</ArStack>
</template>
