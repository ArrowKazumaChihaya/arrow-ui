<!-- スイッチ | すぐ効く切り替え。36×20・地は field、入ればテーマ色。文字ありは高さ22（入と切の文字は重ならず、幅は長い方に合う）。sm は 28×16。 -->
<script setup lang="ts">
import { ArSwitch, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const a = ref(true);
const b = ref(false);
const c = ref(true);
const d = ref(false);
const e = ref(true);
</script>

<template>
<ArCluster :gap="4">
  <ArSwitch v-model="a" label="公開する" />
  <ArSwitch v-model="b" label="公開する" />
  <ArSwitch v-model="c" label="公開" on-text="公開" off-text="非公開" />
  <ArSwitch v-model="d" label="公開" on-text="公開" off-text="非公開" />
  <ArSwitch v-model="e" size="sm" label="小" />
  <ArSwitch :model-value="true" disabled label="使えない" />
  <ArSwitch :model-value="false" disabled label="使えない" />
</ArCluster>
</template>
