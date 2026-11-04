<!-- メールの本文（通知のメールテンプレート） | plain で文字と改行だけ（貼り付けも文字だけ・Enter は改行）。toolbar は変数・元に戻す・やり直す。「ARROW 差し込み項目」を押すと下にタブ・探す欄・札のパネル。文字数はツールバーの右（count-placement="toolbar"）。 -->
<script setup lang="ts">
import { ArRichTextEditor, type ArVariableGroup } from "@s_and_a/arrow-ui";
import { ref } from "vue";

const g = (key: string, label: string, names: string[], prefix: string): ArVariableGroup => ({
  key,
  label,
  items: names.map((n) => ({ key: `${key}_${n}`, label: n, token: `{${prefix}:${n}}` })),
});
const groups = [
  g("co", "会社情報", ["会社名", "会社名(カナ)", "事業所名", "担当者名", "担当者役職", "電話番号", "住所", "url", "締め日", "支払日", "支払月", "役員名"], "会社"),
  g("emp", "社員情報", ["社員名", "社員名(カナ)", "社員コード", "メールアドレス", "雇用区分", "役職", "主所属店舗名", "入社年月日(西暦)", "入社年月日(和暦)", "勤務形態", "基本給の種類", "通勤手当金額", "週所定労働日数", "シフトページでの表示名", "契約開始年月日(西暦)", "契約終了年月日(西暦)"], "社員"),
  g("sp", "メール固有情報", ["入社手続きURL", "入力期限", "ログインID"], "メール"),
];
const body = ref(
  "{社員:社員名} 様<br><br>このたびは {会社:会社名} へのご入社、誠におめでとうございます。<br>入社の手続きのため、下のページから必要な情報の入力をお願いいたします。<br><br>入社手続きページ：{メール:入社手続きURL}<br>入力の期限：{メール:入力期限}<br><br>スマートフォンからも入力できます。<br>ご不明な点は、{会社:担当者名}（{会社:電話番号}）までお問い合わせください。<br><br>{会社:会社名}",
);
const open = ref(true);
</script>

<template>
<div style="max-width: 820px">
  <ArRichTextEditor
    v-model="body"
    v-model:variables-open="open"
    plain
    label="内容"
    :toolbar="['variables', '|', 'undo', 'redo']"
    :variables="groups"
    variables-label="ARROW 差し込み項目"
    variables-note="押すと、入力していた場所に差し込みます"
    :token-pattern="/\{(会社|社員|メール):[^{}]+\}/g"
    count-placement="toolbar"
    :labels="{ count: '{n}文字' }"
    min-height="300px"
  />
</div>
</template>
