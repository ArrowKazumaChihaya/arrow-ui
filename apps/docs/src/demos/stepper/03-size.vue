<!-- 大きさ | size の3つの段。sm＝設定など密集した所、md＝ふつう（既定）、lg＝年末調整・スマホ。同じ段の入力・セレクト・ボタンと高さがそろう。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArStepper, ArButton, ArStack, ArCluster } from "@s_and_a/arrow-ui";
const v = ref(23);
const p = ref(2);
const sizes = ["sm", "md", "lg"] as const;
</script>

<template>
<ArStack :gap="4">
  <ArCluster v-for="s in sizes" :key="s" :gap="3" align="center">
    <ArStepper v-model="v" :size="s" :min="1" :max="31" :label="`日（${s}）`" />
    <ArStepper v-model="p" :size="s" variant="split" :min="1" unit="人" :label="`人数（${s}）`" />
    <ArButton :size="s">{{ s }}</ArButton>
  </ArCluster>
</ArStack>
</template>
