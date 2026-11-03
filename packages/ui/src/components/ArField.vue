<script setup lang="ts">
/**
 * ArField 1.0 — 入力の項目（ラベル・必須の札・説明・間違い）。
 * ラベルが上（.lbl 12.5px 太字）と横（120px 右寄せ）。間違いは入力の下に赤い文字で、直し方まで書く（.derr）。
 * 中の入力とは default slot の値（id・aria-*・invalid）を v-bind して結ぶ。ArForm の中では name で検証の結果を受け取る。
 */
import { computed, inject, onBeforeUnmount, watch } from "vue";
import { useId } from "../provider/context";
import { arFormKey } from "../internal/form";
import ArIcon from "./ArIcon.vue";
import type { ArFieldControlProps, ArFieldProps } from "./ArField.contract";

const props = withDefaults(defineProps<ArFieldProps>(), {
  required: undefined,
  help: undefined,
  error: undefined,
  name: undefined,
  layout: undefined,
  labelSize: undefined,
  labelWidth: undefined,
  requiredText: "必須",
  id: undefined,
});
defineSlots<{ default(props: ArFieldControlProps): unknown }>();

const form = inject(arFormKey, null);
const auto = useId("ar-field");
const id = computed(() => props.id ?? auto);
const labelId = `${auto}-label`;
const helpId = `${auto}-help`;
const errorId = `${auto}-error`;
/** ant-design-vue の名前（horizontal・vertical）も受ける。 */
const layout = computed(() => {
  const l = props.layout ?? form?.layout.value ?? "stacked";
  return l === "horizontal" ? "inline" : l === "vertical" ? "stacked" : l;
});
const labelSize = computed(() => props.labelSize ?? form?.labelSize.value ?? "md");
const labelWidth = computed(() => props.labelWidth ?? form?.labelWidth.value);
const error = computed(() => props.error ?? (props.name && form ? form.errorOf(props.name) : undefined));
const required = computed(() => props.required ?? (props.name && form ? form.isRequired(props.name) : false));

const control = computed<ArFieldControlProps>(() => {
  const describedBy = [error.value && errorId, props.help && helpId].filter(Boolean).join(" ");
  return {
    id: id.value,
    invalid: !!error.value,
    "aria-labelledby": labelId,
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
    ...(error.value ? { "aria-invalid": "true" as const } : {}),
    ...(required.value ? { "aria-required": "true" as const } : {}),
  };
});

if (form && props.name) {
  const label = computed(() => props.label);
  watch(
    id,
    (now, before) => {
      if (before) form.unregister(props.name!, before);
      form.register(props.name!, now, label);
    },
    { immediate: true },
  );
  onBeforeUnmount(() => form.unregister(props.name!, id.value));
}

/** ラベルを押したら入力へ。ネイティブの入力でない（セレクトなど）ときも同じにする。 */
function onLabelClick(e: MouseEvent) {
  const el = document.getElementById(id.value);
  if (!el || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(el.tagName)) return;
  e.preventDefault();
  el.focus();
}
function onFocusOut(e: FocusEvent) {
  if (!form || !props.name) return;
  const next = e.relatedTarget as Node | null;
  if (next && (e.currentTarget as HTMLElement).contains(next)) return;
  form.touch(props.name);
}
</script>

<template>
  <div
    data-ar="field"
    data-part="root"
    :data-layout="layout"
    :data-label-size="layout === 'inline' ? labelSize : undefined"
    :style="layout === 'inline' && labelWidth ? { '--ar-field-label': labelWidth } : undefined"
    :data-state="error ? 'invalid' : undefined"
    @focusout="onFocusOut"
  >
    <label :id="labelId" data-part="label" :for="id" :data-empty="!label || undefined" @click="onLabelClick"
      >{{ label }}<span v-if="required" data-part="required">{{ requiredText }}</span></label
    >
    <div data-part="control">
      <slot v-bind="control" />
      <p v-if="error" :id="errorId" data-part="error" role="alert"><ArIcon name="alert" size="sm" />{{ error }}</p>
      <p v-if="help" :id="helpId" data-part="help">{{ help }}</p>
    </div>
  </div>
</template>
