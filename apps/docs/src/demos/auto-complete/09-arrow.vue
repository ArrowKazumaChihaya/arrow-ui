<!-- 今の ARROW の使い方 | 今の ARROW の Candidate と同じ：押すと候補が開き、先頭の「リセット」（reset-option）で空にできる。打った文字はそのまま値になる。 -->
<script setup lang="ts">
import { ArAutoComplete } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const types = ["正社員", "アルバイト", "パート", "役員"];
const a = ref("");
const b = ref("山田");
</script>

<template>
<div class="g">
  <div><small>empty</small><ArAutoComplete v-model="a" :options="types" :filter="false" :min-chars="0" reset-option placeholder="未選択" label="雇用形態" style="width: 200px" /></div>
  <div><small>text</small><ArAutoComplete v-model="b" :options="types" :filter="false" :min-chars="0" reset-option placeholder="未選択" label="名前" style="width: 200px" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
