<!-- 見るだけの行・？・未登録・項目名の下の補足（会社情報・社員情報） | 値を見せる行。「？」（help）で説明の吹き出し、まだ入っていない値は「未登録」と理由の札（unregistered）、項目名の下に補足（caption）。 -->
<script setup lang="ts">
import { ArItem, ArTextInput } from "@arrow/ui";
import { ref } from "vue";
const nick = ref("マユ");
const kana = ref("");
</script>

<template>
<div style="width: 1080px; max-width: 100%; box-sizing: border-box; padding: 8px 24px; border-radius: 18px; background: #fff">
  <ArItem variant="row" title="所轄税務署" title-width="210px">渋谷（署番号 01105、税務署番号 1105）</ArItem>
  <ArItem variant="row" title="整理番号" title-width="210px" unregistered="源泉徴収票・法定調書合計表に必要です" />
  <ArItem variant="row" title="事業所整理記号" title-width="210px" help="健康保険・厚生年金保険の「保険料納入告知額・領収済額通知書」の右上に書いてある記号です。" info="保険料納入告知額・領収済額通知書に記載されている記号です">01-アロテ</ArItem>
  <ArItem variant="row" title="雇用保険適用事業所番号" title-width="210px" help="雇用保険の「適用事業所設置届事業主控」に書いてある番号です。" unregistered="雇用保険の手続きに必要です" info="雇用保険適用事業所設置届事業主控などに記載されている番号です" />
  <ArItem variant="row" title="ニックネーム" title-width="230px" caption="登録するとマイページのシフトで表示名がニックネームになります" changed @revert="nick = 'まゆ'">
    <template #default="c"><ArTextInput v-bind="c" v-model="nick" style="width: 260px" /></template>
  </ArItem>
  <ArItem variant="row" title="会社名（カナ）" title-width="230px" required error="会社名（カナ）を入力してください" info="個人事業主の場合は事業主の氏名">
    <template #default="c"><ArTextInput v-bind="c" v-model="kana" placeholder="カナ" invalid style="width: 420px" /></template>
  </ArItem>
</div>
</template>
