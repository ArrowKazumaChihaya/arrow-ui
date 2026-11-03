<!-- 幅に合わせた格子 | min-item で1つの最小幅を決めると、入る数だけ並ぶ。columns で列の数を固定もできる。 -->
<script setup lang="ts">
import { ArGrid } from "@arrow/ui";
</script>

<template>
<ArGrid min-item="sm" :gap="3">
  <div v-for="n in 6" :key="n" class="demo-box">{{ n }}</div>
</ArGrid>
</template>
