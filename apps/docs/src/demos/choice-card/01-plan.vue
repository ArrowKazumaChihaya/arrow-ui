<!-- プランと支払い方法 | variant="card"（既定）。value と v-model で1つを選ぶ組（role="radiogroup" の箱に並べる。←→で隣へ）。選べない札は disabled と reason（鍵の印と理由）、今の契約は tag。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArChoiceCard, ArThemeScope } from "@s_and_a/arrow-ui";
const plan = ref("c");
const pay = ref("bank");
</script>

<template>
  <ArThemeScope palette="teal"><div style="display: flex; flex-direction: column; gap: 20px; max-width: 928px">
    <div role="radiogroup" aria-label="プラン" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px">
      <ArChoiceCard v-model="plan" value="a" title="Aプラン" tag="このプランは選択できません" tag-tone="neutral" disabled reason="BプランからAプランに変更することはできません" />
      <ArChoiceCard v-model="plan" value="b" title="Bプラン" tag="ご利用中のプラン" disabled />
      <ArChoiceCard v-model="plan" value="c" title="Cプラン" />
    </div>
    <div role="radiogroup" aria-label="お支払い方法" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px">
      <ArChoiceCard v-model="pay" value="card" icon="card" title="クレジットカード" description="カード情報は決済代行会社のページで入力します" tag="ご利用中のお支払い方法" disabled reason="現在ご利用中のお支払い方法のため選択できません" />
      <ArChoiceCard v-model="pay" value="bank" icon="bld" title="口座振替" description="変更後に口座振替依頼書をお送りします" />
    </div>
  </div></ArThemeScope>
</template>
