<!-- ラジオカード（年末調整の なし／あり） | variant="radio"。2つを横に並べて1つを選ぶ。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArChoiceCard, ArThemeScope } from "@arrow/ui";
const ins = ref(false);
const prev = ref(true);
</script>

<template>
  <ArThemeScope palette="yellow">
    <div style="display: flex; flex-direction: column; gap: 14px; max-width: 556px">
      <div role="radiogroup" aria-label="本年の保険料" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px">
        <ArChoiceCard v-model="ins" variant="radio" :value="false" title="なし" />
        <ArChoiceCard v-model="ins" variant="radio" :value="true" title="あり" />
      </div>
      <div role="radiogroup" aria-label="前職分の給与" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px">
        <ArChoiceCard v-model="prev" variant="radio" :value="false" title="なし" />
        <ArChoiceCard v-model="prev" variant="radio" :value="true" title="あり" />
      </div>
      <div role="radiogroup" aria-label="住宅ローン控除" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px">
        <ArChoiceCard :model-value="false" variant="radio" :value="false" title="なし" disabled />
        <ArChoiceCard :model-value="false" variant="radio" :value="true" title="あり" disabled />
      </div>
    </div>
  </ArThemeScope>
</template>
