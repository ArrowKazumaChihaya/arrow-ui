<!-- 状態 | 間違い（赤）・注意（黄）・使えない・読み取りのみ・filled。 -->
<script setup lang="ts">
import { ArTextarea, ArGrid } from "@arrow/ui";
</script>

<template>
<ArGrid min-item="sm" :gap="3">
  <ArTextarea model-value="間違い" invalid :rows="2" label="間違い" />
  <ArTextarea model-value="注意" warning :rows="2" label="注意" />
  <ArTextarea model-value="使えない" disabled :rows="2" label="使えない" />
  <ArTextarea model-value="読み取りのみ" readonly :rows="2" label="読み取りのみ" />
  <ArTextarea model-value="" variant="filled" placeholder="filled" :rows="2" label="filled" />
</ArGrid>
</template>
