<!-- 今の ARROW の使い方 | 今の ARROW の Input と同じ値で並べる（幅は画面ごとに決める：ここでは 200px と 120px）。数は align="right"。 -->
<script setup lang="ts">
import { ArTextInput } from "@arrow/ui";
import { ref } from "vue";
const a = ref("");
const b = ref("山田 太郎");
const n = ref("1,200");
const z = ref("1500001");
</script>

<template>
<div class="g">
  <div><small>empty</small><ArTextInput v-model="a" placeholder="入力してください" label="名前" style="width: 200px" /></div>
  <div><small>value</small><ArTextInput v-model="b" label="名前" style="width: 200px" /></div>
  <div><small>number right</small><ArTextInput v-model="n" align="right" label="金額" style="width: 120px" /></div>
  <div><small>disabled</small><ArTextInput model-value="" placeholder="変更できません" disabled label="使えない" style="width: 200px" /></div>
  <div><small>status=error</small><ArTextInput model-value="不正な値" invalid label="間違い" style="width: 200px" /></div>
  <div><small>mask ###-####</small><ArTextInput v-model="z" label="郵便番号" style="width: 120px" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
