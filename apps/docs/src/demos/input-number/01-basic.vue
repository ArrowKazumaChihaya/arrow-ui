<!-- 金額・時給・人数 | 右に▲▼。数字は等幅で、確定すると3桁ごとにカンマ。prefix（¥）・suffix（人）。↑↓で増減、Shift で10倍。 -->
<script setup lang="ts">
import { ArInputNumber, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const wage = ref<number | null>(1200);
const people = ref<number | null>(8);
const rate = ref<number | null>(1.25);
</script>

<template>
<ArCluster :gap="4" align="center" wrap="wrap">
  <ArInputNumber v-model="wage" prefix="¥" :min="0" :step="10" label="時給" />
  <ArInputNumber v-model="people" suffix="人" :min="1" :max="99" :controls="false" label="人数" />
  <ArInputNumber v-model="rate" :step="0.05" :min="1" :max="2" suffix="倍" label="割増" />
</ArCluster>
</template>
