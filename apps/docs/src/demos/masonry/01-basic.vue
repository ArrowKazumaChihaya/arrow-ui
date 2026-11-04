<!-- 詰めて並べる | 高さの違うカード（お知らせ・イベント）を列に詰める。カードは角丸12・線1px（見た目は中のカードが持つ）。min-column-width を渡すと幅に合わせて列が減る。 -->
<script setup lang="ts">
import { ArMasonry } from "@s_and_a/arrow-ui";
const notes = [
  ["朝礼", "10:00 全員"], ["棚卸し", "閉店後に在庫を数える。担当は早番から2名。"], ["研修", "新人3名"], ["健康診断", "9:00〜12:00 本社。対象者は通知を確認。"],
  ["定休日", ""], ["売上目標", "本日の目標を共有。昨年比105%。"], ["清掃", "月末"], ["面談", "店長と1人15分"],
];
</script>

<template>
<ArMasonry :columns="4" :min-column-width="160" :gap="3">
  <div v-for="[t, d] in notes" :key="t" style="border-radius: 12px; background: #fff; box-shadow: inset 0 0 0 1px #E6EBF0; padding: 10px; font-size: 12px; color: #4A5562; line-height: 1.5">
    <b style="display: block; color: #1F2933; font-size: 13px; margin-bottom: 4px">{{ t }}</b>{{ d }}
  </div>
</ArMasonry>
</template>
