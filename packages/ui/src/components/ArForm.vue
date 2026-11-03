<script setup lang="ts">
/**
 * ArForm 1.0 — ArField を縦（ラベルが上）か横（ラベルが左・120px 右寄せ）に並べる枠。
 * rules を受けて name ごとに確かめ、間違いを ArField に出す（必須の札も自動）。送ると確かめ、合っていれば submit、
 * 間違いがあれば invalid を出し、summary なら上に間違いのまとめ（押すとその項目へ）を出して最初の項目へフォーカスする。
 */
import { computed, nextTick, provide, reactive, ref, shallowReactive, toRef, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import { arFormKey } from "../internal/form";
import type { ComputedRef } from "vue";
import type { ArFormProps, ArFormRule } from "./ArForm.contract";

const props = withDefaults(defineProps<ArFormProps>(), {
  rules: () => ({}),
  layout: "stacked",
  labelSize: "md",
  labelWidth: undefined,
  validateOn: "blur",
  summary: false,
  summaryTitle: "入力に間違いが{n}件あります",
  errors: () => ({}),
});
const emit = defineEmits<{
  /** 送って、全部合っていたとき。 */
  submit: [model: Record<string, unknown>];
  /** 送って、間違いがあったとき。name → 文。 */
  invalid: [errors: Record<string, string>];
}>();
defineSlots<{ default(): unknown }>();

const own = reactive<Record<string, string | undefined>>({});
const submitted = ref(false);
const summaryEl = ref<HTMLElement | null>(null);
const fields = shallowReactive(new Map<string, { id: string; label: ComputedRef<string> }>());
const rulesOf = (name: string): readonly ArFormRule[] => {
  const r = props.rules[name];
  return r ? (Array.isArray(r) ? r : [r as ArFormRule]) : [];
};
const isEmpty = (v: unknown) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

async function check(name: string): Promise<string | undefined> {
  const value = props.model[name];
  const label = fields.get(name)?.label.value ?? name;
  for (const r of rulesOf(name)) {
    if (r.required && isEmpty(value)) return r.message ?? `${label}を入れてください`;
    if (isEmpty(value)) continue;
    if (typeof value === "number") {
      if (r.min !== undefined && value < r.min) return r.message ?? `${label}は${r.min}以上にしてください`;
      if (r.max !== undefined && value > r.max) return r.message ?? `${label}は${r.max}以下にしてください`;
    }
    const len = typeof value === "string" ? [...value].length : Array.isArray(value) ? value.length : undefined;
    if (len !== undefined) {
      if (r.minLength !== undefined && len < r.minLength) return r.message ?? `${label}は${r.minLength}文字以上で入れてください`;
      if (r.maxLength !== undefined && len > r.maxLength) return r.message ?? `${label}は${r.maxLength}文字までにしてください`;
    }
    if (r.pattern && typeof value === "string" && !r.pattern.test(value)) return r.message ?? `${label}の形が正しくありません`;
    if (r.validator) {
      const res = await r.validator(value, props.model);
      if (typeof res === "string" && res) return res;
      if (res === false) return r.message ?? `${label}が正しくありません`;
    }
  }
  return undefined;
}
async function validateField(name: string): Promise<boolean> {
  own[name] = await check(name);
  return !own[name];
}
async function validate(): Promise<boolean> {
  const names = new Set([...Object.keys(props.rules), ...fields.keys()]);
  await Promise.all([...names].map(validateField));
  return Object.keys(errorList.value).length === 0;
}
function clearErrors(name?: string) {
  if (name) own[name] = undefined;
  else for (const k of Object.keys(own)) own[k] = undefined;
  submitted.value = false;
}
const errorOf = (name: string) => props.errors[name] ?? own[name];
const errorList = computed(() => {
  const out: Record<string, string> = {};
  for (const name of new Set([...Object.keys(own), ...Object.keys(props.errors)])) {
    const e = errorOf(name);
    if (e) out[name] = e;
  }
  return out;
});
/** まとめは項目の並び順で。 */
const ordered = computed(() => {
  const order = [...fields.keys()];
  return Object.entries(errorList.value).sort(([a], [b]) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999));
});

// 打つたびに確かめる（change、または一度送ったあと）
watch(
  () => ({ ...props.model }),
  (now, before) => {
    for (const name of Object.keys(now)) {
      if (now[name] === before?.[name]) continue;
      if (props.validateOn === "change" || submitted.value || own[name]) void validateField(name);
    }
  },
);

function focusField(name: string) {
  const id = fields.get(name)?.id;
  const el = id ? document.getElementById(id) : null;
  el?.focus();
  el?.scrollIntoView?.({ block: "center" });
}
async function onSubmit() {
  submitted.value = true;
  const ok = await validate();
  if (ok) emit("submit", props.model);
  else {
    emit("invalid", { ...errorList.value });
    await nextTick();
    if (props.summary) summaryEl.value?.focus();
    else if (ordered.value[0]) focusField(ordered.value[0][0]);
  }
}
function onReset() {
  clearErrors();
}

provide(arFormKey, {
  layout: toRef(props, "layout"),
  labelSize: toRef(props, "labelSize"),
  labelWidth: toRef(props, "labelWidth"),
  errorOf,
  isRequired: (name) => rulesOf(name).some((r) => r.required),
  register: (name, id, label) => fields.set(name, { id, label }),
  unregister: (name, id) => {
    if (fields.get(name)?.id === id) fields.delete(name);
  },
  touch: (name) => {
    if (props.validateOn === "blur" || submitted.value) void validateField(name);
  },
});
defineExpose({ validate, validateField, clearErrors, submit: onSubmit, errors: errorList });
</script>

<template>
  <form data-ar="form" data-part="root" :data-layout="layout" novalidate @submit.prevent="onSubmit" @reset="onReset">
    <div v-if="summary && submitted && ordered.length" ref="summaryEl" data-part="summary" role="alert" tabindex="-1">
      <p data-part="summary-title"><ArIcon name="alert" size="sm" />{{ summaryTitle.replace("{n}", String(ordered.length)) }}</p>
      <ul data-part="summary-list">
        <li v-for="[name, msg] in ordered" :key="name" data-part="summary-item">
          <a :href="fields.get(name) ? `#${fields.get(name)!.id}` : undefined" @click.prevent="focusField(name)">{{ msg }}</a>
        </li>
      </ul>
    </div>
    <slot />
  </form>
</template>
