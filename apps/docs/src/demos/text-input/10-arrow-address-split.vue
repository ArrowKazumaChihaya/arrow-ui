<!-- 今の ARROW の使い方：住所・姓と名 | 住所（Address）は幅200px、姓と名を分けて打つ欄（Split）は幅120px の ArTextInput。 -->
<script setup lang="ts">
import { ArTextInput } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const ad0 = ref("");
const ad1 = ref("東京都渋谷区神宮前1-1-1");
const last = ref("山田");
const first = ref("太郎");
const e = ref("");
</script>

<template>
<div class="g">
  <div><small>address empty</small><ArTextInput v-model="ad0" label="住所" style="width: 200px" /></div>
  <div><small>address value</small><ArTextInput v-model="ad1" label="住所" style="width: 200px" /></div>
  <div><small>姓</small><ArTextInput v-model="last" label="姓" style="width: 120px" /></div>
  <div><small>名</small><ArTextInput v-model="first" label="名" style="width: 120px" /></div>
  <div><small>empty</small><ArTextInput v-model="e" placeholder="姓" label="姓" style="width: 120px" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
