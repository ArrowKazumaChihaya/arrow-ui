<!-- ビットの表示 | ビットの合計の数から、立っている項目の名前を並べる。0 なら「なし」。 -->
<script setup lang="ts">
import { ArFlagView, ArStack } from "@s_and_a/arrow-ui";
const week = ["日", "月", "火", "水", "木", "金", "土"].map((label, i) => ({ value: 1 << i, label }));
</script>

<template>
<ArStack :gap="3">
  <ArFlagView :value="2 + 8 + 32" :options="week" />
  <ArFlagView :value="127" :options="week" />
  <ArFlagView :value="0" :options="week" />
</ArStack>
</template>
