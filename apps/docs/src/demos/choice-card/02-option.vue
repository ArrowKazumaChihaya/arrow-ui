<!-- やり方を選ぶ（社員を追加の4択） | variant="option"。value を渡さないふつうのボタンで、押すと select（次の画面へ進む）。おすすめは tag="推奨" tag-tone="ok"。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArChoiceCard, ArThemeScope } from "@arrow/ui";
const last = ref("");
</script>

<template>
  <ArThemeScope palette="teal"><div style="max-width: 716px; display: flex; flex-direction: column; gap: 12px">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px">
      <ArChoiceCard variant="option" icon="mail" title="入社メールを送信" tag="推奨" tag-tone="ok" description="名前とメールだけ入れて送ると、本人がスマホで住所・口座・扶養などを入力します。入力が済んだら承認します。" @select="last = '入社メールを送信'" />
      <ArChoiceCard variant="option" icon="keyboard" title="手動で追加" description="管理者がすべての項目を入力します。本人にメールを使わないときに。" @select="last = '手動で追加'" />
      <ArChoiceCard variant="option" icon="xls" title="かんたんExcel登録" description="名前・メール・住所・口座など一部の項目を、Excelで何人分もまとめて登録します。" @select="last = 'かんたんExcel登録'" />
      <ArChoiceCard variant="option" icon="xls" title="Excel登録" description="すべての項目をExcel/CSVで登録します。項目ごとのフォーマット（従業員マスタ・時給・住民税…）を選びます。" disabled reason="Cプランで使えます" />
    </div>
    <span style="font-size: 12.5px">select：{{ last || "（まだ）" }}</span>
  </div></ArThemeScope>
</template>
