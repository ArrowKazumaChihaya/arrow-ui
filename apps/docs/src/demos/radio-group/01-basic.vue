<!-- 1つを選ぶ | direction="vertical" で縦に並べる。 -->
<script setup lang="ts">
import { ArRadioGroup, ArStack } from "@arrow/ui";
import { ref } from "vue";
const v = ref<string | number | boolean | null>("next");
const opts = [{ value: "next", label: "次の回だけ" }, { value: "after", label: "これ以降" }, { value: "all", label: "すべて" }];
</script>

<template>
<ArStack :gap="4">
  <ArRadioGroup v-model="v" :options="opts" label="変更する範囲" />
  <ArRadioGroup v-model="v" :options="opts" direction="vertical" label="変更する範囲（縦）" />
</ArStack>
</template>
