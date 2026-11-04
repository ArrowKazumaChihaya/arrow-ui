<!-- 会社で保存する組み合わせ | presets に保存した組み合わせ（会社／自分）を渡すと上に並び、押すとその組み合わせになる（apply）。今の選び方と同じものに印。saveScopes に company を入れると「会社の既定として保存」、「名前をつけて保存」で名前の欄と保存のボタン（save-preset）。× は delete-preset。部品はブラウザーにも API にも書かない。保存は製品が API でして presets を変える（ここでは見本の中の配列を変えている）。 -->
<script setup lang="ts">
import { ArViewOptions, type ArViewOptionGroup, type ArViewOptionPreset, type ArViewOptionPresetDraft } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const shown = ref(["cnt", "short", "ev"]);
const open = ref(false);
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
  ] },
];
/** 製品が API（会社の設定）から読んだ形。 */
const presets = ref<ArViewOptionPreset[]>([
  { key: "p1", label: "会社の既定", keys: ["cnt", "short", "ev", "sub", "lk", "pub"], scope: "company", default: true },
  { key: "p2", label: "店長の見方", keys: ["cnt", "short", "ev"], scope: "company", deletable: true },
  { key: "p3", label: "提出の確認", keys: ["cnt", "sub"], scope: "personal", deletable: true },
]);
const log = ref("—");
function onSave(d: ArViewOptionPresetDraft) {
  log.value = `save-preset：${d.label}（${d.scope === "company" ? "会社" : "自分"}${d.asDefault ? "・既定" : ""}）`;
  if (d.asDefault) presets.value = presets.value.map((p) => (p.default ? { ...p, keys: d.keys } : p));
  else presets.value = [...presets.value, { key: `p${Date.now()}`, label: d.label, keys: d.keys, scope: d.scope, deletable: true }];
}
</script>

<template>
<div style="min-height: 720px">
  <ArViewOptions
    v-model="shown"
    v-model:open="open"
    :groups="groups"
    :presets="presets"
    :save-scopes="['company', 'personal']"
    label="カレンダーに表示"
    title="カレンダーに出すもの"
    @apply="(p) => (log = `apply：${p.label}`)"
    @save-preset="onSave"
    @delete-preset="(p) => { presets = presets.filter((x) => x.key !== p.key); log = `delete-preset：${p.label}`; }"
  />
  <p style="margin: 12px 0 0; font-size: 12px">出すもの：{{ shown.join("・") || "なし" }} ／ {{ log }}</p>
</div>
</template>
