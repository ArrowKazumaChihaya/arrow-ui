<!-- 日付の入力 | 年はプルダウン（ブラウザの select は使わない。数字を打つとその年へ飛ぶ）、月と日は数字（全角も読む・↑↓で1ずつ）。曜日は自動で、日は赤・土は青。 -->
<script setup lang="ts">
import { ArDateInput, ArStack } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref<string | null>("2026-10-23");
const b = ref<string | null>("2026-11-01");
const c = ref<string | null>("2026-10-24");
</script>

<template>
<ArStack :gap="3" align="start">
  <ArDateInput v-model="a" label="日付" :min-year="2025" :max-year="2027" />
  <ArDateInput v-model="b" label="始まりの日" />
  <ArDateInput v-model="c" label="終わりの日" />
  <span class="demo-note">値：{{ a ?? "—" }}</span>
</ArStack>
</template>
