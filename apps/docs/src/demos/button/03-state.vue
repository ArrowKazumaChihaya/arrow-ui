<!-- 読み込み中・押せない・横いっぱい | loading の間は押せない。block は親の幅いっぱい。 -->
<script setup lang="ts">
import { ArButton, ArCluster, ArStack } from "@arrow/ui";
import { ref } from "vue";
const busy = ref(false);
function save() { busy.value = true; setTimeout(() => (busy.value = false), 1500); }
</script>

<template>
<ArStack :gap="3">
  <ArCluster :gap="2">
    <ArButton tone="primary" icon="check" :loading="busy" @click="save">保存する</ArButton>
    <ArButton tone="secondary" disabled>押せない</ArButton>
  </ArCluster>
  <ArButton tone="primary" block>横いっぱい</ArButton>
</ArStack>
</template>
