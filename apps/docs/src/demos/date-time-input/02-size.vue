<!-- 大きさ | size の3つの段。sm＝設定など密集した所、md＝ふつう（既定）、lg＝年末調整・スマホ。同じ段の入力・セレクト・ボタンと高さがそろう。今の見た目では、今の ARROW と同じく時刻の箱は幅58の入れ物から右へはみ出す（後ろに部品を置くときは間を空ける）。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArDateTimeInput, ArStack, ArCluster } from "@arrow/ui";
const v = ref<string | null>("2026-11-03 09:00:00");
const sizes = ["sm", "md", "lg"] as const;
</script>

<template>
<ArStack :gap="4">
  <ArCluster v-for="s in sizes" :key="s" :gap="3" align="center" style="min-height: 44px">
    <ArDateTimeInput v-model="v" :size="s" :label="`公開日時（${s}）`" />
  </ArCluster>
</ArStack>
</template>
