<!-- 年末調整の なし／あり（card・lg・2列） | variant="card"・size="lg"・columns で等しい幅の2列。ArChoiceCard の variant="radio" と同じもの（今はこちらで書く）。今の ARROW で箱に入っている所は variant="card" と書く（classic では今の年調の箱になる。省くと classic は丸と文字だけ）。説明つき（description）は名前の下に灰色の文字。 -->
<script setup lang="ts">
import { ArRadioGroup, ArThemeScope } from "@arrow/ui";
import { ref } from "vue";
const ins = ref<boolean | null>(false);
const prev = ref<boolean | null>(true);
const fr = ref<string | null>("keep");
const yn = [
  { value: false, label: "なし" },
  { value: true, label: "あり" },
];
const how = [
  { value: "done", label: "未回答の人は回答済みにする", description: "まだ開始していない人を、今の社員情報で回答済みにします" },
  { value: "part", label: "回答が途中でも回答済みにする", description: "回答の途中の人も、今の入力内容で回答済みにします" },
  { value: "keep", label: "未回答のまま", description: "回答済みの人と、乙欄・退職者だけを処理します" },
];
</script>

<template>
<ArThemeScope palette="yellow">
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 636px">
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 556px">
    <ArRadioGroup v-model="ins" variant="card" size="lg" :columns="2" :options="yn" label="本年の保険料" />
    <ArRadioGroup v-model="prev" variant="card" size="lg" :columns="2" :options="yn" label="前職分の給与" />
    <ArRadioGroup :model-value="false" variant="card" size="lg" :columns="2" :options="yn" disabled label="住宅ローン控除" />
    </div>
    <ArRadioGroup v-model="fr" variant="card" direction="vertical" style="max-width: 636px" :options="how" label="未回答者への対応" />
  </div>
</ArThemeScope>
</template>
