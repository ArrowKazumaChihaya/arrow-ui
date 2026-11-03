<!-- 日時 | 日付と、時と分のプルダウン（分は5分刻み）。値は "YYYY-MM-DD HH:mm:ss"。どちらかが空なら null。 -->
<script setup lang="ts">
import { ArDateTimeInput } from "@arrow/ui";
import { ref } from "vue";
const v = ref<string | null>("2026-11-03 09:00:00");
const e = ref<string | null>(null);
</script>

<template>
<div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
  <ArDateTimeInput v-model="v" :min-year="1930" :max-year="2026" label="公開日時" />
  <ArDateTimeInput v-model="e" label="締め切り" />
  <ArDateTimeInput model-value="2026-11-03 18:30:00" disabled label="使えない" />
  <span class="demo-note">値：{{ v ?? "—" }}</span>
</div>
</template>
