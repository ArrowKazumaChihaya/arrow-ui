<!-- スライダー | つまみは白にテーマ色の輪。触っている間はつまみの上に値。←→で step、PageUp/PageDown で10倍。 -->
<script setup lang="ts">
import { ArSlider, ArStack } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const v = ref(30);
const range = ref<[number, number]>([9, 21]);
</script>

<template>
<ArStack :gap="6" style="max-width: 540px">
  <ArSlider v-model="v" label="不透明度" />
  <ArSlider v-model="range" range :min="0" :max="24" tooltip="always" :format="(h) => `${h}:00`" label="チャートの表示時間" />
  <ArSlider :model-value="40" disabled label="使えない" />
</ArStack>
</template>
