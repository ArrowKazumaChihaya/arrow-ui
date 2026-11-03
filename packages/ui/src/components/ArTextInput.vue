<script setup lang="ts">
/**
 * ArTextInput 1.0 — 1行の文字の入力（高さ38・角丸10・枠は field）。
 * 頭のアイコン・文字、後ろの単位・アイコン、探す（虫めがね）、パスワード（目のボタンで表示の切り替え）、
 * 文字数、消すボタン、大きさ、間違い・注意・使えない・読み取りのみ。
 * update:modelValue は打つたびに、change は確定したとき（Enter・フォーカスが外れた）に出す。
 * class と style 以外の属性（aria-describedby など）は中の input に渡す。
 */
import { computed, onMounted, ref, useAttrs } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArTextInputProps } from "./ArTextInput.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArTextInputProps>(), {
  type: "text",
  placeholder: undefined,
  size: "md",
  variant: "outlined",
  invalid: false,
  warning: false,
  disabled: false,
  readonly: false,
  icon: undefined,
  prefix: undefined,
  suffix: undefined,
  addonBefore: undefined,
  addonAfter: undefined,
  suffixIcon: undefined,
  clearable: false,
  showCount: false,
  maxlength: undefined,
  block: false,
  label: undefined,
  id: undefined,
  name: undefined,
  inputmode: undefined,
  autocomplete: "off",
  autofocus: false,
  clearLabel: "消す",
});
const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
  /** type="search" で Enter を押したとき。 */
  search: [value: string];
  /** 消すボタンで消したとき。 */
  clear: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const attrs = useAttrs();
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }));
const inputAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs;
  return rest;
});

const input = ref<HTMLInputElement | null>(null);
const revealed = ref(false);
const inputType = computed(() => (props.type === "password" && revealed.value ? "text" : props.type));
const leadIcon = computed(() => props.icon ?? (props.type === "search" ? "search" : undefined));
const canClear = computed(() => props.clearable && !props.disabled && !props.readonly && props.modelValue !== "");
const count = computed(() => {
  const n = [...(props.modelValue ?? "")].length;
  return props.maxlength !== undefined ? `${n} / ${props.maxlength}` : String(n);
});
const invalid = computed(() => props.invalid || attrs["aria-invalid"] === "true" || attrs["aria-invalid"] === true);

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
}
function onEnter() {
  emit("change", props.modelValue);
  if (props.type === "search") emit("search", props.modelValue);
}
function onBlur(e: FocusEvent) {
  emit("change", props.modelValue);
  emit("blur", e);
}
function clear() {
  emit("update:modelValue", "");
  emit("change", "");
  emit("clear");
  input.value?.focus();
}
/** 箱のどこを押しても入力へフォーカスする。 */
function focusInput(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    e.preventDefault();
    input.value?.focus();
  }
}
onMounted(() => {
  if (props.autofocus) input.value?.focus();
});
defineExpose({
  focus: () => input.value?.focus(),
  blur: () => input.value?.blur(),
  select: () => input.value?.select(),
  input,
});
</script>

<template>
  <span
    v-bind="rootAttrs"
    data-ar="text-input"
    data-part="root"
    :data-size="size"
    :data-variant="variant"
    :data-block="block || undefined"
    :data-state="
      [invalid && 'invalid', !invalid && warning && 'warning', disabled && 'disabled', readonly && 'readonly'].filter(Boolean).join(' ') || undefined
    "
    @mousedown="focusInput"
  >
    <span v-if="addonBefore" data-part="addon" data-side="start">{{ addonBefore }}</span>
    <ArIcon v-if="leadIcon" :name="leadIcon" data-part="prefix" data-kind="icon" size="sm" />
    <span v-if="prefix" data-part="prefix" data-kind="text">{{ prefix }}</span>
    <input
      :id="id"
      ref="input"
      v-bind="inputAttrs"
      data-part="input"
      :type="inputType"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      :aria-label="id ? undefined : label"
      :aria-invalid="invalid ? 'true' : undefined"
      @input="onInput"
      @focus="emit('focus', $event)"
      @blur="onBlur"
      @keydown.enter="onEnter"
    />
    <button
      v-if="canClear"
      type="button"
      data-part="clear"
      :aria-label="clearLabel"
      tabindex="-1"
      @mousedown.prevent
      @click="clear"
    >
      <ArIcon name="x" size="sm" />
    </button>
    <span v-if="showCount" data-part="count" aria-live="polite">{{ count }}</span>
    <span v-if="suffix" data-part="suffix" data-kind="text">{{ suffix }}</span>
    <ArIcon v-if="suffixIcon" :name="suffixIcon" data-part="suffix" data-kind="icon" size="sm" />
    <button
      v-if="type === 'password'"
      type="button"
      data-part="reveal"
      :aria-label="revealed ? 'パスワードを隠す' : 'パスワードを表示する'"
      :aria-pressed="revealed"
      :disabled="disabled"
      @mousedown.prevent
      @click="revealed = !revealed"
    >
      <ArIcon :name="revealed ? 'eye' : 'eyeoff'" size="sm" />
    </button>
    <span v-if="addonAfter" data-part="addon" data-side="end">{{ addonAfter }}</span>
  </span>
</template>
