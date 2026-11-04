<!-- 今の ARROW の使い方：入力の順・マスク・数字だけ | class・style は外側の箱、ほかの属性（tabindex・inputmode・maxlength・aria-*）とイベント（@keydown・@beforeinput・@paste・@drop）は中の input へ。input を class で探す仕組み（今の tabindexkey）には input-class。ref から focus()・select()・setSelectionRange()。update:modelValue で直した値（マスク・数字だけ）は、同じ値でも欄にそろう。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArButton, ArCluster, ArStack, ArTextInput } from "@arrow/ui";

/** 今の UI/Input の mask（"###-####"）と同じ整え方。 */
function mask(v: string, format: string) {
  const digits = v.replace(/[^0-9]/g, "");
  let out = "";
  let i = 0;
  for (const ch of format) {
    if (i >= digits.length) break;
    out += ch === "#" ? digits[i++] : ch;
  }
  return out;
}
const zip = ref("");
const tel = ref("");
const num = ref("");
const order = ref(["", "", ""]);
const first = ref<InstanceType<typeof ArTextInput> | null>(null);

/** 今の UI/Input と同じ：←↑ で前、→↓ で後ろ、Tab で tabindex の順に、同じ class の input を移る（文字の頭・終わりのとき）。 */
function move(e: KeyboardEvent) {
  const el = e.target as HTMLInputElement;
  const list = [...document.querySelectorAll<HTMLInputElement>("input.order_key")].sort((a, b) => a.tabIndex - b.tabIndex);
  const i = list.indexOf(el);
  const atStart = el.selectionStart === 0 && el.selectionEnd === 0;
  const atEnd = el.selectionStart === el.value.length && el.selectionEnd === el.value.length;
  let to: HTMLInputElement | undefined;
  if (e.key === "Tab") to = list[i + (e.shiftKey ? -1 : 1)];
  else if ((e.key === "ArrowLeft" || e.key === "ArrowUp") && atStart) to = list[i - 1];
  else if ((e.key === "ArrowRight" || e.key === "ArrowDown") && atEnd) to = list[i + 1];
  if (!to) return;
  e.preventDefault();
  to.focus();
  to.setSelectionRange(0, to.value.length);
}
function onlyDigits(e: InputEvent) {
  if (!e.isComposing && e.data !== null && !/^[0-9]*$/.test(e.data)) e.preventDefault();
}
function pasteDigits(e: ClipboardEvent) {
  if (!/^[0-9]*$/.test(e.clipboardData?.getData("text") ?? "")) e.preventDefault();
}
</script>

<template>
<ArStack :gap="4">
  <ArCluster :gap="3" align="end">
    <div><small>郵便番号（マスク ###-####）</small><br /><ArTextInput :model-value="zip" inputmode="numeric" :maxlength="8" label="郵便番号" style="width: 120px" @update:model-value="(v) => (zip = mask(v, '###-####'))" /></div>
    <div><small>電話（マスク ###-####-####）</small><br /><ArTextInput :model-value="tel" inputmode="tel" label="電話" style="width: 160px" @update:model-value="(v) => (tel = mask(v, '###-####-####'))" /></div>
    <div><small>数字だけ（beforeinput・paste）</small><br /><ArTextInput v-model="num" inputmode="numeric" label="数字だけ" align="right" style="width: 120px" @beforeinput="onlyDigits" @paste="pasteDigits" /></div>
  </ArCluster>
  <ArCluster :gap="3" align="end">
    <div v-for="(n, i) in [3, 1, 2]" :key="i">
      <small>tabindex {{ n }}</small><br />
      <ArTextInput :ref="i === 0 ? (el) => (first = el as any) : undefined" v-model="order[i]!" :tabindex="n" input-class="order_key" :label="`入力の順 ${n}`" style="width: 120px" @keydown="move" />
    </div>
    <ArButton size="sm" tone="secondary" @click="first?.focus(); first?.select()">1つ目へフォーカスして選ぶ</ArButton>
  </ArCluster>
  <p style="margin: 0; font-size: 12px">zip：{{ zip || "—" }} ／ tel：{{ tel || "—" }} ／ num：{{ num || "—" }}（←→↑↓・Tab で tabindex の順に移る）</p>
</ArStack>
</template>
