<!-- 今の ARROW の使い方 | 今の ARROW の Check と同じ並び（枠は灰色 #808080、チェックは antd の青）。 -->
<script setup lang="ts">
import { ArCheckbox } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref(false);
const b = ref(true);
const c = ref(false);
const d = ref(true);
</script>

<template>
<div class="g">
  <div><small>unchecked</small><ArCheckbox v-model="a">同意する</ArCheckbox></div>
  <div><small>checked</small><ArCheckbox v-model="b">同意する</ArCheckbox></div>
  <div><small>indeterminate</small><ArCheckbox v-model="c" indeterminate>一部</ArCheckbox></div>
  <div><small>disabled</small><ArCheckbox :model-value="false" disabled>無効</ArCheckbox></div>
  <div><small>checked disabled</small><ArCheckbox :model-value="true" disabled>無効</ArCheckbox></div>
  <div><small>no label</small><ArCheckbox v-model="d" label="同意" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
