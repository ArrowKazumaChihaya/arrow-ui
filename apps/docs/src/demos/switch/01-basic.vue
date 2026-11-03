<!-- 切り替え | 押した瞬間に効く設定に使う（保存ボタンで確定するものはチェック）。 -->
<script setup lang="ts">
import { ArSwitch, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const a = ref(true);
const b = ref(false);
</script>

<template>
<ArCluster :gap="4" align="center">
  <ArSwitch v-model="a" label="この日を公開する" on-text="公開" off-text="非公開" />
  <ArSwitch v-model="b" label="通知する" />
  <ArSwitch v-model="a" size="sm" label="小" />
  <ArSwitch :model-value="true" loading label="保存中" />
  <ArSwitch :model-value="false" disabled label="押せない" />
</ArCluster>
</template>
