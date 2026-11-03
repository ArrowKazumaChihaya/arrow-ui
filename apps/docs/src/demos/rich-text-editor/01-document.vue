<!-- 書類の編集（自作書類） | paper で白い紙の形。ツールバーの「ARROWの変数」はまとまりのメニュー（variables-placement="menu"）、右の ArVariablePanel を押してもカーソルの位置に入る（ref の insertText）。変数は本文の中で札に見え、v-model の値は `{{ $employee_name }}` のただの文字。 -->
<script setup lang="ts">
import { ArRichTextEditor, ArVariablePanel, type ArVariableGroup } from "@arrow/ui";
import { ref } from "vue";

const groups: ArVariableGroup[] = [
  { key: "company", label: "会社情報", items: [["company_name", "会社名"], ["company_kana", "会社名(カナ)"], ["company_office", "事業所名"], ["company_address", "住所"], ["company_tel", "電話番号"], ["company_close_day", "締め日"], ["company_pay_day", "支払日"], ["company_pay_month", "支払月"], ["company_overtime_rate", "法定外残業割増率(%)"], ["company_night_rate", "深夜割増率(%)"], ["company_officer", "役員名"], ["company_staff", "担当者名"]].map(([key, label]) => ({ key: key!, label: label! })) },
  { key: "employee", label: "社員情報", items: [["employee_name", "社員名"], ["employee_kana", "社員名(カナ)"], ["employee_gender", "性別"], ["employee_birth_date_wareki", "生年月日(和暦)"], ["employee_birth_date", "生年月日(西暦)"], ["employee_address", "住所"], ["employee_zip", "郵便番号"], ["employee_type", "雇用区分"], ["employee_post", "役職"], ["employee_code", "社員コード"], ["employee_joined_wareki", "入社年月日(和暦)"], ["employee_joined", "入社年月日(西暦)"], ["employee_monthly_wage", "基本給金額(月額)"], ["employee_commute", "通勤手当金額"], ["employee_week_hours", "週所定労働時間"], ["employee_standard_pay", "標準報酬月額"]].map(([key, label]) => ({ key: key!, label: label! })) },
  { key: "custom", label: "カスタム情報", items: [{ key: "custom_uniform", label: "制服サイズ" }, { key: "custom_license_comma", label: "資格(カンマ区切り)" }, { key: "custom_license_dot", label: "資格(中黒区切り)" }] },
  { key: "other", label: "その他", items: [{ key: "created_wareki", label: "作成日(和暦)" }, { key: "created", label: "作成日(西暦)" }, { key: "sign", label: "署名(合意が必要な書類で合意後に表示)" }] },
];
const html = ref(`<h1>雇用契約書</h1>
<table><tbody><tr><th>フリガナ<br>氏名</th><td>{{ $employee_kana }}<br>{{ $employee_name }}</td><th>生年月日</th><td>{{ $employee_birth_date_wareki }}</td></tr><tr><th>現住所</th><td colspan="3">{{ $employee_zip }} {{ $employee_address }}</td></tr></tbody></table>
<p>以下の条件により雇用契約を締結する。</p>
<table><tbody><tr><th>雇用期間</th><td>契約日：令和8年4月1日〜令和9年3月31日</td></tr><tr><th>就業場所</th><td>{{ $company_name }} {{ $employee_branch }}</td></tr><tr><th>業務内容</th><td>店舗での接客・販売</td></tr><tr><th>勤務時間</th><td>シフトによる（1日8時間以内）</td></tr><tr><th>賃金</th><td>基本給 {{ $employee_monthly_wage }}　締め日：{{ $company_close_day }}　支払日：{{ $company_pay_day }}</td></tr></tbody></table>
<p>{{ $created_wareki }}</p>
<p>（甲）{{ $company_address }}　{{ $company_name }}</p>`);
const editor = ref<InstanceType<typeof ArRichTextEditor> | null>(null);
const help = ref(0);
</script>

<template>
<div style="display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 14px; align-items: start">
  <ArRichTextEditor
    ref="editor"
    v-model="html"
    paper
    label="書類内容"
    :variables="groups"
    variables-placement="menu"
    max-height="560px"
    @help="help++"
  >
    <template #footer-extra><span>{{ help ? "ヘルプを開きました" : "表や改ページも入れられます" }}</span></template>
  </ArRichTextEditor>
  <ArVariablePanel
    title="ARROWの変数"
    description="押すと、本文のカーソルの位置に入ります。社員ごとの内容に置き換わります。"
    :groups="groups"
    style="max-height: 560px"
    @insert="(t) => editor?.insertText(t)"
  />
</div>
</template>
