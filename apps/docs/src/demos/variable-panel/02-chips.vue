<!-- タブと札（chips） | 通知のメールテンプレートの「ARROW 差し込み項目」。まとまりのタブ（件数つき・←→で選び直す）・探す欄・「＋ 名前」の札。札の部分は max-height で巻き取る。下に description の説明。 -->
<script setup lang="ts">
import { ArVariablePanel, type ArVariableGroup } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const mk = (key: string, label: string, prefix: string, names: string[]): ArVariableGroup => ({ key, label, items: names.map((n) => ({ key: `${key}_${n}`, label: n, token: `{${prefix}:${n}}` })) });
const groups = [
  mk("co", "会社情報", "会社", ["会社名", "会社名(カナ)", "事業所名", "担当者名", "担当者役職", "電話番号", "住所", "url", "締め日", "支払日", "支払月", "役員名"]),
  mk("emp", "社員情報", "社員", ["社員名", "社員名(カナ)", "社員コード", "メールアドレス", "雇用区分", "役職", "主所属店舗名", "入社年月日(西暦)", "入社年月日(和暦)", "勤務形態", "基本給の種類", "通勤手当金額", "週所定労働日数", "シフトページでの表示名", "契約開始年月日(西暦)", "契約終了年月日(西暦)"]),
  mk("sp", "メール固有情報", "メール", ["入社手続きURL", "入力期限", "ログインID"]),
];
const tab = ref("emp");
const last = ref("");
</script>

<template>
<div style="max-width: 800px; display: flex; flex-direction: column; gap: 10px">
  <ArVariablePanel
    v-model:tab="tab"
    layout="chips"
    :groups="groups"
    :labels="{ search: '差し込む項目を探す', searchPlaceholder: '項目を探す（例：入社）', empty: '見つかりません。ほかの言葉で探してください', tabs: '差し込み項目のまとまり', insert: '{label}を差し込む' }"
    description="押すと、入力していた場所に差し込みます（内容の最後）"
    max-height="112px"
    @insert="(t) => (last = t)"
  />
  <div style="font-size: 13px">入れた文字：<code>{{ last || "（まだ）" }}</code></div>
</div>
</template>
