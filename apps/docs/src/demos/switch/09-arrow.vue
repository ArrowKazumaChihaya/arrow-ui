<!-- 今の ARROW の使い方 | 今の ARROW の Toggle と同じ並び。色は既定（antd の青）か、tone="accent"（ページのテーマ色）。two-way は「一覧／カレンダー」のような2択の切り替え（切れていても色）。 -->
<script setup lang="ts">
import { ArSwitch, ArThemeScope, ArIcon } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const off = ref(false);
const on = ref(true);
const view = ref(true);
const t = ref(true);
const pal = [
  ["shift", "blue"],
  ["attendance", "green"],
  ["payment", "yellow"],
  ["aggregation", "amber"],
  ["document", "pink"],
] as const;
</script>

<template>
<div class="g">
  <div><small>off</small><ArSwitch v-model="off" label="有効" /></div>
  <div><small>on</small><ArSwitch v-model="on" label="有効" /></div>
  <div><small>on disabled</small><ArSwitch :model-value="true" disabled label="有効" /></div>
  <div><small>off disabled</small><ArSwitch :model-value="false" disabled label="有効" /></div>
  <div v-for="[name, p] in pal" :key="name">
    <small>on theme={{ name }}</small>
    <ArThemeScope :palette="p"><ArSwitch :model-value="true" tone="accent" :label="name" /></ArThemeScope>
  </div>
  <div><small>alwaysValid shift off</small><ArSwitch :model-value="false" tone="accent" two-way label="表示" /></div>
  <div>
    <small>with icons（シフト提出）</small>
    <ArSwitch v-model="view" tone="accent" two-way label="カレンダーで見る">
      <template #before><ArIcon name="menu" class="ic" /></template>
      <template #after><ArIcon name="cal" class="ic" /></template>
    </ArSwitch>
  </div>
  <div><small>with text slot</small><ArSwitch v-model="t" label="有効">有効</ArSwitch></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
.ic { color: var(--ar-accent); }
</style>
