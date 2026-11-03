<!-- 選ぶタイル（書類の種類） | variant="tile"。小さなアイコンと名前、下に件数（description）。選ぶとテーマ色の面。右の札は tag。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArChoiceCard, ArThemeScope } from "@arrow/ui";
import type { ArIconName } from "@arrow/ui";
const kind = ref("pay");
const kinds: [string, string, ArIconName, string][] = [
  ["join", "入社関連", "users", "4種類"], ["out", "退社関連", "user", "5種類"], ["pay", "給与関連", "yen", "7種類"], ["remu", "報酬関連", "hand", "4種類"],
  ["tax", "税・社会保険関連", "info", "9種類"], ["nencho", "年末調整関連", "star", "7種類"], ["other", "その他", "folder", "3種類"], ["custom", "自作書類", "pen", "4種類"],
];
const doc = ref("slip");
</script>

<template>
  <ArThemeScope palette="pink">
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 940px">
      <div role="radiogroup" aria-label="書類の種類" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px">
        <ArChoiceCard v-for="k in kinds" :key="k[0]" v-model="kind" variant="tile" :value="k[0]" :icon="k[2]" :title="k[1]" :description="k[3]" />
      </div>
      <div role="radiogroup" aria-label="書類" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px">
        <ArChoiceCard v-model="doc" variant="tile" value="slip" title="給与明細書" />
        <ArChoiceCard v-model="doc" variant="tile" value="bonus" title="賞与明細書" />
        <ArChoiceCard v-model="doc" variant="tile" value="gensen" title="源泉徴収票(受給者用)" tag="年1回" />
        <ArChoiceCard v-model="doc" variant="tile" value="ledger" title="賃金台帳" disabled />
      </div>
    </div>
  </ArThemeScope>
</template>
