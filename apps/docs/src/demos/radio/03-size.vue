<!-- 大きさと形（sm・md・lg ／ plain・card） | ArRadioGroup の選択肢と同じもの（丸の印・カードの見た目は1つ）。単独で置くときも variant="card"・size・description が使える。 -->
<script setup lang="ts">
import { ArRadio } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const sizes = ["sm", "md", "lg"] as const;
const v = ref<string | null>("a");
</script>

<template>
<div class="t">
  <template v-for="z in sizes" :key="z">
    <small>{{ z }}</small>
    <div class="r">
      <ArRadio v-model="v" value="a" :name="`r-${z}`" :size="z">Aプラン</ArRadio>
      <ArRadio v-model="v" value="b" :name="`r-${z}`" :size="z">Bプラン</ArRadio>
      <ArRadio v-model="v" value="a" :name="`c-${z}`" variant="card" :size="z">Aプラン</ArRadio>
      <ArRadio v-model="v" value="b" :name="`c-${z}`" variant="card" :size="z" description="月 300 円">Bプラン</ArRadio>
    </div>
  </template>
</div>
</template>

<style scoped>
.t { display: grid; grid-template-columns: 40px 1fr; gap: 14px 12px; align-items: center; }
.r { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
