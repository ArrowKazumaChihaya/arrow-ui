<!-- 乗せて開く | trigger="hover" は乗せると開き、外れると閉じる（吹き出しへ移る間は閉じない）。キーボードではフォーカスで開く。 -->
<script setup lang="ts">
import { ArButton, ArCluster, ArPopover } from "@s_and_a/arrow-ui";
const places = ["top", "bottom", "left", "right"] as const;
</script>

<template>
<ArCluster :gap="3" align="center">
  <ArPopover v-for="p in places" :key="p" trigger="hover" :placement="p" :title="`${p} に出す`" content="乗せている間だけ出ます。" :width="200">
    <ArButton tone="secondary" size="sm">{{ p }}</ArButton>
  </ArPopover>
</ArCluster>
</template>
