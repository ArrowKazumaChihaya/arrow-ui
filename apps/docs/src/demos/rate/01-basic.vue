<!-- 評価 | 星は黄（テーマ色ではなく決まった色）。allowHalf で半分の星。readonly は見せるだけ。←→で動かせる。 -->
<script setup lang="ts">
import { ArRate, ArStack, ArCluster } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref(4);
const b = ref(3.5);
</script>

<template>
<ArStack :gap="3">
  <ArCluster :gap="3"><ArRate v-model="a" label="面談の評価" /><span class="demo-note">{{ a.toFixed(1) }} ／ 面談の評価</span></ArCluster>
  <ArCluster :gap="3"><ArRate v-model="b" allow-half label="半分の星" /><span class="demo-note">{{ b.toFixed(1) }}</span></ArCluster>
  <ArCluster :gap="3"><ArRate :model-value="3" readonly label="見せるだけ" /><span class="demo-note">readonly</span></ArCluster>
  <ArCluster :gap="3"><ArRate :model-value="2" disabled label="使えない" /><span class="demo-note">disabled</span></ArCluster>
</ArStack>
</template>
