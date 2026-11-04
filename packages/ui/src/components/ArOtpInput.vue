<script setup lang="ts">
/**
 * ArOtpInput 1.0 — 認証コードの欄。6桁を1桁ずつの箱で入れる（打つと次へ・Backspace で前へ・←→で動く・貼り付けで全部の箱に入る）。
 * 数字だけを受け取る。全部入ると complete。resendable で下に「認証コードを再送（あと45秒）」を出し、秒数を数える。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue";
import { useDesignForm, useId } from "../provider/context";
import type { ArOtpInputProps } from "./ArOtpInput.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArOtpInputProps>(), {
  length: 6,
  invalid: false,
  disabled: false,
  label: "認証コード",
  autofocus: false,
  resendable: false,
  resendIn: 0,
  cooldown: 60,
  labels: () => ({}),
});
const emit = defineEmits<{ "update:modelValue": [value: string]; complete: [value: string]; resend: [] }>();
const attrs = useAttrs();
const form = useDesignForm<"split" | "single">("ArOtpInput", "fields", "split");
const id = useId("ar-otp");
const inputs = ref<HTMLInputElement[]>([]);
const single = ref<HTMLInputElement | null>(null);

const invalid = computed(() => props.invalid || attrs["aria-invalid"] === "true" || attrs["aria-invalid"] === true);
const digits = computed(() => {
  const v = (props.modelValue ?? "").replace(/\D/g, "").slice(0, props.length);
  return Array.from({ length: props.length }, (_, i) => v[i] ?? "");
});
const rootAttrs = computed(() => {
  const { id: _id, "aria-invalid": _inv, "aria-describedby": _d, "aria-required": _r, "aria-labelledby": _l, ...rest } = attrs as Record<string, unknown>;
  return rest;
});
const firstId = computed(() => (attrs.id as string | undefined) ?? `${id}-0`);

function commit(arr: string[]) {
  const v = arr.join("");
  emit("update:modelValue", v);
  if (v.length === props.length && arr.every((d) => d !== "")) emit("complete", v);
}
function focusAt(i: number) {
  const el = inputs.value[Math.max(0, Math.min(props.length - 1, i))];
  if (el) {
    el.focus();
    el.select();
  }
}
/** i 番目から文字列を入れる（打つ・貼り付け共通）。 */
function fillFrom(i: number, text: string) {
  const ds = text.replace(/\D/g, "");
  if (!ds) return;
  const arr = [...digits.value];
  // 先頭の箱に貼ったときは、全部の箱を貼った数字で入れ直す
  const start = ds.length >= props.length ? 0 : i;
  for (let k = 0; k < ds.length && start + k < props.length; k++) arr[start + k] = ds[k]!;
  // 間を空けない（空の箱があればそこへ詰める）
  const packed = arr.join("").split("");
  const out = Array.from({ length: props.length }, (_, k) => packed[k] ?? "");
  commit(out);
  nextTick(() => focusAt(Math.min(out.filter(Boolean).length, props.length - 1)));
}
function onInput(i: number, e: Event) {
  const el = e.target as HTMLInputElement;
  const raw = el.value;
  el.value = digits.value[i] ?? "";
  if (!raw) {
    const arr = [...digits.value];
    arr[i] = "";
    commit(arr);
    return;
  }
  // 箱に1桁入っていて、もう1桁打ったときは新しい方
  const typed = raw.length > 1 && raw.startsWith(digits.value[i] ?? "") ? raw.slice((digits.value[i] ?? "").length) : raw;
  fillFrom(i, typed);
}
function onKeydown(i: number, e: KeyboardEvent) {
  if (e.key === "Backspace") {
    e.preventDefault();
    const arr = [...digits.value];
    if (arr[i]) {
      arr.splice(i, 1);
      arr.push("");
      commit(arr);
    } else if (i > 0) {
      arr.splice(i - 1, 1);
      arr.push("");
      commit(arr);
      focusAt(i - 1);
    }
  } else if (e.key === "Delete") {
    e.preventDefault();
    const arr = [...digits.value];
    arr.splice(i, 1);
    arr.push("");
    commit(arr);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    focusAt(i - 1);
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    focusAt(i + 1);
  } else if (e.key === "Home") {
    e.preventDefault();
    focusAt(0);
  } else if (e.key === "End") {
    e.preventDefault();
    focusAt(props.length - 1);
  } else if (e.key.length === 1 && !/\d/.test(e.key) && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
  }
}
function onPaste(i: number, e: ClipboardEvent) {
  const text = e.clipboardData?.getData("text") ?? "";
  e.preventDefault();
  fillFrom(i, text);
}
function onFocus(i: number, e: FocusEvent) {
  // まだ前に空の箱があるときは、そこへ動かす（順に入れる）
  const firstEmpty = digits.value.findIndex((d) => d === "");
  if (firstEmpty !== -1 && firstEmpty < i) {
    focusAt(firstEmpty);
    return;
  }
  (e.target as HTMLInputElement).select();
}
function onSingleInput(e: Event) {
  const el = e.target as HTMLInputElement;
  const v = el.value.replace(/\D/g, "").slice(0, props.length);
  el.value = v;
  commit(Array.from({ length: props.length }, (_, k) => v[k] ?? ""));
}

// Single and split layouts share the same draft. If the theme changes while the
// user is editing, continue at the corresponding digit in the new layout.
watch(form, async (next) => {
  const active = document.activeElement;
  if (!(active instanceof HTMLInputElement)) return;
  const index = inputs.value.findIndex((input) => input === active);
  if (active !== single.value && index < 0) return;
  const start = active === single.value ? (active.selectionStart ?? 0) : index;
  const end = active === single.value ? (active.selectionEnd ?? start) : index + 1;
  await nextTick();
  if (document.activeElement !== active && document.activeElement !== document.body) return;
  if (next === "single") {
    single.value?.focus();
    single.value?.setSelectionRange(start, end);
  } else focusAt(start);
});

/* 再送までの秒数 */
const remaining = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;
function startCount(sec: number) {
  if (timer) clearInterval(timer);
  remaining.value = Math.max(0, Math.floor(sec));
  if (remaining.value > 0)
    timer = setInterval(() => {
      remaining.value -= 1;
      if (remaining.value <= 0 && timer) {
        clearInterval(timer);
        timer = undefined;
      }
    }, 1000);
}
watch(() => props.resendIn, (s) => startCount(s ?? 0), { immediate: true });
onBeforeUnmount(() => timer && clearInterval(timer));
const resendText = computed(() =>
  remaining.value > 0
    ? (props.labels.wait ?? "認証コードを再送（あと{s}秒）").replace("{s}", String(remaining.value))
    : (props.labels.resend ?? "認証コードを再送"),
);
function resend() {
  if (remaining.value > 0 || props.disabled) return;
  emit("resend");
  startCount(props.cooldown);
}

onMounted(() => {
  if (props.autofocus) (form.value === "single" ? single.value : inputs.value[0])?.focus();
});
defineExpose({ focus: () => (form.value === "single" ? single.value?.focus() : focusAt(digits.value.findIndex((d) => d === "") === -1 ? props.length - 1 : digits.value.findIndex((d) => d === ""))) });
</script>

<template>
  <div
    data-ar="otp-input"
    data-part="root"
    :data-fields="form"
    :data-state="[invalid && 'invalid', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
    v-bind="rootAttrs"
  >
    <div v-if="form === 'single'" data-part="fields">
      <input
        ref="single"
        :id="firstId"
        data-part="input"
        :value="digits.join('')"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        :maxlength="length"
        :placeholder="'0'.repeat(length)"
        :aria-label="label"
        :aria-labelledby="attrs['aria-labelledby'] as string | undefined"
        :aria-required="attrs['aria-required'] as boolean | 'true' | 'false' | undefined"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="(attrs['aria-describedby'] as string | undefined)"
        :disabled="disabled"
        @input="onSingleInput"
      />
    </div>
    <div v-else data-part="fields" role="group" :aria-label="label" :aria-labelledby="attrs['aria-labelledby'] as string | undefined">
      <input
        v-for="(d, i) in digits"
        :key="i"
        :ref="(el) => { if (el) inputs[i] = el as HTMLInputElement; }"
        :id="i === 0 ? firstId : `${id}-${i}`"
        data-part="cell"
        :data-state="d ? 'filled' : undefined"
        :value="d"
        type="text"
        inputmode="numeric"
        :autocomplete="i === 0 ? 'one-time-code' : 'off'"
        maxlength="2"
        :aria-label="`${label} ${i + 1}桁目`"
        :aria-required="attrs['aria-required'] as boolean | 'true' | 'false' | undefined"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="i === 0 ? (attrs['aria-describedby'] as string | undefined) : undefined"
        :disabled="disabled"
        @input="onInput(i, $event)"
        @keydown="onKeydown(i, $event)"
        @paste="onPaste(i, $event)"
        @focus="onFocus(i, $event)"
      />
    </div>
    <button v-if="resendable" type="button" data-part="resend" :disabled="disabled || remaining > 0" aria-live="polite" @click="resend">{{ resendText }}</button>
  </div>
</template>
