<!-- 表示内容の選択 | 見出しごとのチェックの並び（名前・1行の説明・見え方の見本）。ボタンには選んでいる数。「すべて表示」で全部に戻す。↑↓ で移り Space で切り替え、Escape で閉じる。 -->
<script setup lang="ts">
import { ArViewOptions, type ArViewOptionGroup } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const shown = ref(["cnt", "short", "ev", "sub", "lk"]);
const open = ref(true);
const groups: ArViewOptionGroup[] = [
  { label: "店舗・日ごと（人数・不足・イベント）", options: [
    { key: "cnt", label: "人数", description: "その日のシフトの人数", sample: { text: "4名", color: "#4A5562" } },
    { key: "short", label: "不足", description: "募集人数に足りない人数", sample: { text: "不足1", background: "#FDECEA", color: "#B4231C" } },
    { key: "ev", label: "イベント", description: "色の点と名前", sample: { text: "● 朝礼", color: "#7146C3" } },
  ] },
  { label: "従業員から", options: [
    { key: "sub", label: "提出", description: "希望シフトを出した人数", sample: { text: "提出2", background: "#E3F4EA", color: "#1E7A4C" } },
  ] },
  { label: "状態", options: [
    { key: "lk", label: "ロック中", description: "斜線の地と右上の鍵", sample: { icon: "lock", background: "repeating-linear-gradient(135deg,#F7F9FB 0 3px,#E3E8EE 3px 6px)", color: "#8592A0", ring: "inset 0 0 0 1px #E3E8EE" } },
    { key: "pub", label: "非公開", description: "左上に目の印", sample: { icon: "eyeoff", background: "#F7F9FB", color: "#8592A0", ring: "inset 0 0 0 1px #E6EBF0" } },
    { key: "always", label: "日付", description: "いつも出す", disabled: true },
  ] },
];
</script>

<template>
<div style="min-height: 520px">
  <ArViewOptions v-model="shown" v-model:open="open" :groups="groups" label="カレンダーに表示" title="カレンダーに出すもの" />
  <p style="margin: 12px 0 0; font-size: 12px">出すもの：{{ shown.join("・") || "なし" }}</p>
</div>
</template>
