<script setup lang="ts">
/**
 * ArZipInput 1.0 — 郵便番号。数字だけを受け付け（全角も読む）、3桁のあとに「-」を自動で入れる。
 * 7桁そろうと lookup（製品が渡す関数）で住所を引き、見つかれば address を出す。引いている間と見つからないときは右に小さく出す。
 */
import { nextTick, ref } from "vue";
import ArTextInput from "./ArTextInput.vue";
import type { ArZipInputProps } from "./ArZipInput.contract";

const props = withDefaults(defineProps<ArZipInputProps>(), {
  lookup: undefined,
  invalid: false,
  disabled: false,
  label: undefined,
  id: undefined,
  placeholder: "123-4567",
  labels: () => ({ searching: "住所を探しています…", notFound: "住所が見つかりませんでした", failed: "住所を引けませんでした" }),
});
const emit = defineEmits<{ "update:modelValue": [value: string | null]; address: [address: string, zip: string] }>();

/** 数字を「###-####」に整える。 */
function format(text: string): string {
  const d = text.normalize("NFKC").replace(/\D/g, "").slice(0, 7);
  return d.length > 3 ? `${d.slice(0, 3)}-${d.slice(3)}` : d;
}
const status = ref<"idle" | "searching" | "not-found" | "failed">("idle");
let seq = 0;
async function find(zip: string) {
  if (!props.lookup) return;
  const my = ++seq;
  status.value = "searching";
  try {
    const address = await props.lookup(zip);
    if (my !== seq) return;
    if (address) {
      status.value = "idle";
      emit("address", address, zip);
    } else status.value = "not-found";
  } catch {
    if (my === seq) status.value = "failed";
  }
}
const root = ref<HTMLElement | null>(null);
function onInput(v: string) {
  const z = format(v);
  emit("update:modelValue", z === "" ? null : z);
  // 数字以外を打ったときなど、値が変わらなくても欄の文字を整えた形に戻す
  void nextTick(() => {
    const el = root.value?.querySelector("input");
    if (el && el.value !== (props.modelValue ?? "")) el.value = props.modelValue ?? "";
  });
  seq++;
  status.value = "idle";
  if (z.length === 8) void find(z);
}
const statusText = () =>
  status.value === "searching" ? props.labels.searching : status.value === "not-found" ? props.labels.notFound : status.value === "failed" ? props.labels.failed : "";
</script>

<template>
  <span ref="root" data-ar="zip-input" data-part="root" :data-state="status !== 'idle' ? status : undefined">
    <ArTextInput
      :id="id"
      :model-value="modelValue ?? ''"
      type="tel"
      inputmode="numeric"
      autocomplete="postal-code"
      :maxlength="8"
      :placeholder="placeholder"
      :label="label"
      :invalid="invalid"
      :disabled="disabled"
      @update:model-value="onInput"
    />
    <span data-part="status" role="status" aria-live="polite">{{ statusText() }}</span>
  </span>
</template>
