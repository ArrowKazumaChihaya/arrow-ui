<!-- 複数選ぶ | multiple は選んだものを札（淡いテーマ色）で並べ、max-tags を超えると「+n」にまとめる。札の × で外せる。 -->
<script setup lang="ts">
import { ArSelect, ArStack } from "@arrow/ui";
import { ref } from "vue";
const patterns = ref<(string | number)[]>(["early", "late", "night", "full"]);
const few = ref<(string | number)[]>([]);
const options = [
  { value: "early", label: "早番" },
  { value: "late", label: "遅番" },
  { value: "night", label: "夜勤" },
  { value: "full", label: "通し" },
  { value: "half", label: "半日" },
];
</script>

<template>
<ArStack :gap="3" align="start">
  <ArSelect v-model="patterns" :options="options" multiple label="パターン" style="width: 260px" />
  <ArSelect v-model="patterns" :options="options" multiple :max-tags="5" clearable label="パターン（全部出す）" style="width: 360px" />
  <ArSelect v-model="few" :options="options" multiple placeholder="パターンを選ぶ" label="パターン（未選択）" style="width: 260px" />
</ArStack>
</template>
