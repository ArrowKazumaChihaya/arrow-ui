<!-- 縦のパネル（list） | 書類集計の自作書類の右の「ARROWの変数」。まとまりの見出しの下に「＋ 名前」。探すと名前・変数名に合うものだけ（合わなければ「「…」に合う変数はありません」）。押すと insert（入れる文字・変数・まとまり）。 -->
<script setup lang="ts">
import { ArVariablePanel, type ArVariableGroup } from "@arrow/ui";
import { ref } from "vue";
const groups: ArVariableGroup[] = [
  { key: "company", label: "会社情報", items: ["会社名", "会社名(カナ)", "事業所名", "住所", "電話番号", "締め日", "支払日", "支払月"].map((label, i) => ({ key: `company_${i}`, label })) },
  { key: "employee", label: "社員情報", items: ["社員名", "社員名(カナ)", "性別", "生年月日(和暦)", "入社年月日(和暦)", "入社年月日(西暦)", "雇用区分", "役職"].map((label, i) => ({ key: `employee_${i}`, label, keywords: label.includes("入社") ? ["入った日"] : [] })) },
  { key: "other", label: "その他", items: [{ key: "created_wareki", label: "作成日(和暦)" }, { key: "created", label: "作成日(西暦)" }] },
];
const last = ref("");
const q = ref("入社");
</script>

<template>
<div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start">
  <ArVariablePanel
    title="ARROWの変数"
    description="押すと、本文のカーソルの位置に入ります。社員ごとの内容に置き換わります。"
    :groups="groups"
    style="width: 260px; height: 440px"
    @insert="(t) => (last = t)"
  />
  <ArVariablePanel v-model:query="q" title="探したとき" :groups="groups" style="width: 260px; height: 440px" @insert="(t) => (last = t)" />
  <ArVariablePanel title="押せない" :groups="groups.slice(2)" disabled :searchable="false" style="width: 220px" />
  <div style="font-size: 13px">入れた文字：<code>{{ last || "（まだ）" }}</code></div>
</div>
</template>
