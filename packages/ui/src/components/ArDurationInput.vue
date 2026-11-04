<script setup lang="ts">
/**
 * ArDurationInput 1.1 — 時間の長さの入力（「1 時間 30 分」）。値は分。
 * 時間と分の2つの箱を単位の文字でつなぐ。分を2桁（または6〜9）打つと次の入力へ移る。空の分で Backspace・端の ←→ で隣の箱へ。
 * 値の確定は箱からフォーカスが外れたとき・Enter だけ。分が空なら null、時間だけ空なら 0 時間。
 */
import { computed, nextTick, ref, watch } from "vue";
import type { ArDurationInputProps } from "./ArDurationInput.contract";

const props = withDefaults(defineProps<ArDurationInputProps>(), {
  maxHours: 999,
  invalid: false,
  size: "md",
  disabled: false,
  label: undefined,
  id: undefined,
  labels: () => ({ hour: "時間", minute: "分" }),
});
const emit = defineEmits<{ "update:modelValue": [value: number | null]; commit: [value: number | null] }>();

const root = ref<HTMLElement | null>(null);
const hourEl = ref<HTMLInputElement | null>(null);
const minuteEl = ref<HTMLInputElement | null>(null);
const split = (v: number | null): [string, string] =>
  v == null || !Number.isFinite(v) || v < 0 ? ["", ""] : [String(Math.floor(v / 60)), String(Math.round(v) % 60).padStart(2, "0")];
const [h0, m0] = split(props.modelValue);
const hour = ref(h0);
const minute = ref(m0);
const focused = ref(false);
watch(
  () => props.modelValue,
  (v) => {
    if (focused.value) return;
    [hour.value, minute.value] = split(v);
  },
);
const value = computed<number | null>(() => (minute.value === "" ? null : Number(hour.value || 0) * 60 + Number(minute.value)));
const state = computed(
  () => [props.invalid && "invalid", props.disabled && "disabled", !hour.value && !minute.value && "empty"].filter(Boolean).join(" ") || undefined,
);

function commit() {
  const v = value.value;
  if (v !== props.modelValue) {
    emit("update:modelValue", v);
    emit("commit", v);
  }
}
const digits = (s: string) => s.normalize("NFKC").replace(/\D/g, "");
function focusBox(el: HTMLInputElement | null | undefined) {
  el?.focus();
  el?.select();
}
function onHour(e: Event) {
  const el = e.target as HTMLInputElement;
  let v = digits(el.value).replace(/^0+(?=\d)/, "");
  if (Number(v) > props.maxHours) v = v.slice(0, -1);
  el.value = v;
  hour.value = v;
}
function onMinute(e: Event) {
  const el = e.target as HTMLInputElement;
  let v = digits(el.value);
  let advance = false;
  if (v.length >= 2) {
    v = v.slice(0, 2);
    if (Number(v) > 59) v = v.slice(0, 1);
    else advance = true;
  } else if (v.length === 1 && Number(v) >= 6) {
    v = `0${v}`;
    advance = true;
  }
  el.value = v;
  minute.value = v;
  if (advance) nextTick(() => commit());
}
function onKey(e: KeyboardEvent, which: "hour" | "minute") {
  const el = e.target as HTMLInputElement;
  if (e.key === "Enter") return commit();
  const atStart = el.selectionStart === 0 && el.selectionEnd === 0;
  const atEnd = el.selectionStart === el.value.length && el.selectionEnd === el.value.length;
  if (which === "minute" && ((e.key === "Backspace" && el.value === "") || (e.key === "ArrowLeft" && atStart))) {
    e.preventDefault();
    focusBox(hourEl.value);
  } else if (which === "hour" && e.key === "ArrowRight" && atEnd) {
    e.preventDefault();
    focusBox(minuteEl.value);
  }
}
function onFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as Node | null;
  if (next && root.value?.contains(next)) return;
  focused.value = false;
  commit();
}
</script>

<template>
  <span ref="root" data-ar="duration-input" data-part="root" :data-size="size" role="group" :aria-label="label" :data-state="state" @focusout="onFocusOut">
    <input
      :id="id"
      ref="hourEl"
      data-part="hour"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      :value="hour"
      :disabled="disabled"
      :aria-label="label ? `${label}の${labels.hour}` : labels.hour"
      :aria-invalid="invalid ? 'true' : undefined"
      @focus="focused = true"
      @input="onHour"
      @keydown="onKey($event, 'hour')"
    /><span data-part="unit" aria-hidden="true">{{ labels.hour }}</span
    ><input
      ref="minuteEl"
      data-part="minute"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      maxlength="2"
      :value="minute"
      :disabled="disabled"
      :aria-label="label ? `${label}の${labels.minute}` : labels.minute"
      :aria-invalid="invalid ? 'true' : undefined"
      @focus="focused = true"
      @input="onMinute"
      @keydown="onKey($event, 'minute')"
    /><span data-part="unit" aria-hidden="true">{{ labels.minute }}</span>
  </span>
</template>
