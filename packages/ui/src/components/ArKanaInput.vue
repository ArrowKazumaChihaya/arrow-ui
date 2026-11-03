<script setup lang="ts">
/**
 * ArKanaInput 1.0 — 氏名とフリガナの入力。姓・名の2つの欄と、その下にセイ・メイの2つの欄。
 * 値は「姓 名」のように半角の空白でつないだ1つの文字（今の ARROW の employee.name・kana と同じ形）。
 * フリガナはひらがなで打っても、確定（フォーカスが外れる・Enter）でカタカナに直す。
 */
import { computed } from "vue";
import ArTextInput from "./ArTextInput.vue";
import type { ArKanaInputProps } from "./ArKanaInput.contract";

const props = withDefaults(defineProps<ArKanaInputProps>(), {
  kana: null,
  showKana: true,
  katakana: true,
  invalid: false,
  kanaInvalid: false,
  disabled: false,
  label: undefined,
  id: undefined,
  labels: () => ({ last: "姓", first: "名", lastKana: "セイ", firstKana: "メイ", kana: "フリガナ" }),
});
const emit = defineEmits<{ "update:name": [value: string | null]; "update:kana": [value: string | null] }>();

/** "姓 名" を2つに分ける（全角の空白も区切りとして読む）。 */
function split(v: string | null | undefined): [string, string] {
  if (!v) return ["", ""];
  const s = v.replace(/　/g, " ");
  const i = s.indexOf(" ");
  return i < 0 ? [s, ""] : [s.slice(0, i), s.slice(i + 1)];
}
function join(a: string, b: string): string | null {
  const x = a.trim();
  const y = b.trim();
  return x || y ? `${x} ${y}`.replace(/ $/, "") : null;
}
const toKatakana = (s: string) => s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));

const nameParts = computed(() => split(props.name));
const kanaParts = computed(() => split(props.kana));
function setName(i: 0 | 1, v: string) {
  const p = [...nameParts.value] as [string, string];
  p[i] = v.replace(/[ 　]/g, "");
  emit("update:name", join(p[0], p[1]));
}
function setKana(i: 0 | 1, v: string) {
  const p = [...kanaParts.value] as [string, string];
  p[i] = v.replace(/[ 　]/g, "");
  emit("update:kana", join(p[0], p[1]));
}
function commitKana(i: 0 | 1) {
  if (!props.katakana) return;
  const p = [...kanaParts.value] as [string, string];
  const k = toKatakana(p[i]);
  if (k !== p[i]) setKana(i, k);
}
</script>

<template>
  <div
    data-ar="kana-input"
    data-part="root"
    role="group"
    :aria-label="label"
    :data-state="[invalid && 'invalid', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
  >
    <div data-part="row" data-row="name">
      <ArTextInput
        :id="id"
        :model-value="nameParts[0]"
        :placeholder="labels.last"
        :label="`${label ?? ''}${labels.last}`"
        :invalid="invalid"
        :disabled="disabled"
        autocomplete="family-name"
        @update:model-value="setName(0, $event)"
      />
      <ArTextInput
        :model-value="nameParts[1]"
        :placeholder="labels.first"
        :label="`${label ?? ''}${labels.first}`"
        :invalid="invalid"
        :disabled="disabled"
        autocomplete="given-name"
        @update:model-value="setName(1, $event)"
      />
    </div>
    <div v-if="showKana" data-part="row" data-row="kana">
      <ArTextInput
        :model-value="kanaParts[0]"
        :placeholder="labels.lastKana"
        :label="`${labels.kana}（${labels.last}）`"
        :invalid="invalid || kanaInvalid"
        :disabled="disabled"
        @update:model-value="setKana(0, $event)"
        @change="commitKana(0)"
      />
      <ArTextInput
        :model-value="kanaParts[1]"
        :placeholder="labels.firstKana"
        :label="`${labels.kana}（${labels.first}）`"
        :invalid="invalid || kanaInvalid"
        :disabled="disabled"
        @update:model-value="setKana(1, $event)"
        @change="commitKana(1)"
      />
    </div>
  </div>
</template>
