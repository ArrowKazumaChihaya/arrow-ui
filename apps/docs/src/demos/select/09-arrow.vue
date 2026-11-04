<!-- 今の ARROW の使い方 | 今の ARROW の Select と同じ：先頭に「未選択」（null-option）、プルダウンの下に「新規作成」のボタン（actions）。幅は画面ごと（ここでは 200px、表の表示件数は 80px）。 -->
<script setup lang="ts">
import { ArSelect } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const types = [
  { value: "full", label: "正社員" },
  { value: "part", label: "アルバイト" },
  { value: "pt", label: "パート" },
  { value: "exe", label: "役員" },
];
const a = ref<string | null>(null);
const b = ref<string | null>("part");
const c = ref<number | null>(10);
const made = ref(0);
</script>

<template>
<div class="g">
  <div><small>placeholder</small><ArSelect v-model="a" :options="types" null-option placeholder="未選択" label="雇用形態" style="width: 200px" /></div>
  <div><small>selected</small><ArSelect v-model="b" :options="types" null-option placeholder="未選択" :actions="[{ value: 'new', label: '新規作成', icon: 'plus' }]" label="雇用形態" style="width: 200px" @action="made++" /></div>
  <div><small>disabled</small><ArSelect model-value="part" :options="types" disabled label="雇用形態" style="width: 200px" /></div>
  <div><small>width 80px（表の表示件数）</small><ArSelect v-model="c" :options="[10, 20, 50, 100].map((n) => ({ value: n, label: String(n) }))" label="表示件数" style="width: 80px" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
