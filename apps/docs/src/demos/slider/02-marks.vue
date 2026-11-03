<!-- 目盛り | marks で点と文字。step=null なら目盛りの値にだけ止まる（ドラッグの間隔：5・10・15・20・30分）。 -->
<script setup lang="ts">
import { ArSlider, ArStack } from "@arrow/ui";
import { ref } from "vue";
const v = ref(2);
const labels = ["5分", "10分", "15分", "20分", "30分"];
</script>

<template>
<ArStack :gap="3" style="max-width: 540px">
  <ArSlider v-model="v" :min="0" :max="4" :step="null" :marks="labels.map((l, i) => ({ value: i, label: l }))" :format="(i) => labels[i] ?? ''" label="ドラッグの間隔" />
  <span class="demo-note">値：{{ labels[v] }}</span>
</ArStack>
</template>
