<!-- 状態 | 間違い（invalid）・使えない。範囲で終わりが前なら赤くなる。 -->
<script setup lang="ts">
import { ArDatePicker, ArStack } from "@arrow/ui";
</script>

<template>
<ArStack :gap="3" align="start">
  <ArDatePicker model-value="2026-10-21" invalid label="間違い" />
  <ArDatePicker :model-value="{ start: '2026-11-30', end: '2026-11-01' }" range label="逆の範囲" />
  <ArDatePicker model-value="2026-10-21" disabled label="使えない" />
</ArStack>
</template>
