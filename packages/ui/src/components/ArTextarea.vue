<script setup lang="ts">
/**
 * ArTextarea 1.1 — 複数行の文字の入力（備考・メモ）。
 * 枠は 1行の入力と同じ（角丸10・枠 field・フォーカスはテーマ色の枠と淡い輪）。行の高さ1.6。
 * autosize で中身に合わせて高さを変え、show-count で右下に文字数を出す。
 * class と style 以外の属性（aria-describedby など）は中の textarea に渡す。
 */
import { computed, nextTick, onMounted, ref, useAttrs, watch } from "vue";
import type { ArTextareaProps } from "./ArTextarea.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArTextareaProps>(), {
  placeholder: undefined,
  rows: 3,
  autosize: false,
  maxlength: undefined,
  showCount: false,
  variant: "outlined",
  resize: "vertical",
  invalid: false,
  warning: false,
  size: "md",
  disabled: false,
  readonly: false,
  label: undefined,
  id: undefined,
  name: undefined,
});
const emit = defineEmits<{
  "update:modelValue": [value: string];
  /** 確定したとき（フォーカスが外れた）。 */
  change: [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const attrs = useAttrs();
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }));
const inputAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs;
  return rest;
});
const el = ref<HTMLTextAreaElement | null>(null);
const invalid = computed(() => props.invalid || attrs["aria-invalid"] === "true" || attrs["aria-invalid"] === true);
const count = computed(() => {
  const n = [...(props.modelValue ?? "")].length;
  return props.maxlength !== undefined ? `${n} / ${props.maxlength}` : String(n);
});
const auto = computed(() => (props.autosize === true ? {} : props.autosize || null));

/** 中身に合わせて高さを決める（行の高さ×行数＋上下の余白と枠）。 */
function fit() {
  const t = el.value;
  const a = auto.value;
  if (!t || !a) return;
  const cs = getComputedStyle(t);
  const line = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.6 || 22;
  const extra = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth) || 0;
  const min = (a.minRows ?? 2) * line + extra;
  const max = a.maxRows ? a.maxRows * line + extra : Infinity;
  t.style.height = "auto";
  const want = t.scrollHeight + (parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth) || 0);
  const h = Math.min(max, Math.max(min, want));
  t.style.height = `${h}px`;
  t.style.overflowY = want > max ? "auto" : "hidden";
}
watch(() => props.modelValue, () => nextTick(fit));
watch(auto, () => nextTick(fit), { deep: true });
onMounted(fit);

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLTextAreaElement).value);
  fit();
}
function onBlur(e: FocusEvent) {
  emit("change", props.modelValue);
  emit("blur", e);
}
defineExpose({ focus: () => el.value?.focus(), blur: () => el.value?.blur(), textarea: el });
</script>

<template>
  <div
    v-bind="rootAttrs"
    data-ar="textarea"
    data-part="root"
    :data-size="size"
    :data-variant="variant"
    :data-resize="auto ? 'none' : resize"
    :data-state="
      [invalid && 'invalid', !invalid && warning && 'warning', disabled && 'disabled', readonly && 'readonly'].filter(Boolean).join(' ') || undefined
    "
  >
    <textarea
      :id="id"
      ref="el"
      v-bind="inputAttrs"
      data-part="input"
      :name="name"
      :value="modelValue"
      :rows="auto ? (auto.minRows ?? 2) : rows"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="disabled"
      :readonly="readonly"
      :aria-label="id ? undefined : label"
      :aria-invalid="invalid ? 'true' : undefined"
      @input="onInput"
      @focus="emit('focus', $event)"
      @blur="onBlur"
    />
    <div v-if="showCount" data-part="count" aria-live="polite">{{ count }}</div>
  </div>
</template>
