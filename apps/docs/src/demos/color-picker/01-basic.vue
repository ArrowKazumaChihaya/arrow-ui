<!-- 色の選択 | ふだんは決まった色（.sws）から選び、自由な色は「自由な色を選ぶ」で色の面・色相の帯・HEX。選ぶたびにすぐ値が変わる。 -->
<script setup lang="ts">
import { ArColorPicker, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const a = ref<string | null>("#8E6BC4");
const b = ref<string | null>("#5591CE");
const c = ref<string | null>(null);
</script>

<template>
<ArCluster :gap="4">
  <ArColorPicker v-model="a" label="イベントの色" />
  <ArColorPicker v-model="b" detail-open label="パターンの色（詳細を開いておく）" />
  <ArColorPicker v-model="c" :custom="false" label="決まった色だけ" />
  <ArColorPicker model-value="#2E9A6B" disabled label="使えない" />
</ArCluster>
</template>
