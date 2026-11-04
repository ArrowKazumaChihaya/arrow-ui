<!-- 向き | 上下左右と、端をそろえる -start・-end。入らなければ反対へ返し、矢印はいつも基準の要素を指す。 -->
<script setup lang="ts">
import { ArButton, ArStack, ArCluster, ArTooltip } from "@s_and_a/arrow-ui";
const rows = [
  ["top-start", "top", "top-end"],
  ["left-start", "left", "right", "right-start"],
  ["bottom-start", "bottom", "bottom-end"],
] as const;
</script>

<template>
<ArStack :gap="3" align="center">
  <ArCluster v-for="(r, i) in rows" :key="i" :gap="3">
    <ArTooltip v-for="p in r" :key="p" :title="`${p} の吹き出し`" :placement="p">
      <ArButton tone="secondary" size="sm">{{ p }}</ArButton>
    </ArTooltip>
  </ArCluster>
</ArStack>
</template>
