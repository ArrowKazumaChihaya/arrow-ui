<script setup lang="ts">
/**
 * ArPopconfirm 1.0 — その場の小さな確認。中のボタンを押すと、そのそばに問いと「やめる／主なボタン」を出す。
 * 消すときは okTone="danger"。外を押す・Esc でやめる。開くと主なボタンにフォーカスし、閉じるときっかけに戻す。
 */
import { computed, nextTick, ref, watch } from "vue";
import ArFloat from "../internal/ArFloat.vue";
import ArIcon from "./ArIcon.vue";
import ArButton from "./ArButton.vue";
import { useId } from "../provider/context";
import type { ArPopconfirmProps } from "./ArPopconfirm.contract";

const props = withDefaults(defineProps<ArPopconfirmProps>(), {
  description: undefined,
  okText: "OK",
  cancelText: "やめる",
  okTone: "primary",
  icon: "alert",
  iconTone: undefined,
  placement: "top-start",
  open: undefined,
  disabled: false,
});
const emit = defineEmits<{ "update:open": [open: boolean]; confirm: []; cancel: [] }>();
defineOptions({ inheritAttrs: false });

const id = useId("ar-popconfirm");
const anchor = ref<HTMLElement | null>(null);
const inner = ref(false);
const isOpen = computed(() => props.open ?? inner.value);
const tone = computed(() => props.iconTone ?? (props.okTone === "danger" ? "danger" : "warn"));

function set(v: boolean) {
  inner.value = v;
  emit("update:open", v);
}
function toggle() {
  if (props.disabled) return;
  set(!isOpen.value);
}
function cancel(back = true) {
  emit("cancel");
  set(false);
  if (back) focusTrigger();
}
function ok() {
  emit("confirm");
  set(false);
  focusTrigger();
}
function focusTrigger() {
  const t = anchor.value?.querySelector<HTMLElement>("button,a[href],[tabindex]") ?? null;
  t?.focus();
}
watch(isOpen, async (o) => {
  if (!o) return;
  await nextTick();
  await nextTick();
  document.getElementById(id)?.querySelector<HTMLElement>('[data-part="footer"]>[data-ar="button"]:last-child')?.focus();
});
</script>

<template>
  <span
    ref="anchor"
    v-bind="$attrs"
    data-ar="popconfirm-trigger"
    :aria-haspopup="'dialog'"
    :aria-expanded="isOpen"
    :aria-controls="isOpen ? id : undefined"
    @click="toggle"
  ><slot /></span>
  <ArFloat
    :id="id"
    ar="popconfirm"
    role="alertdialog"
    :open="isOpen"
    :anchor="anchor"
    :placement="placement"
    :offset="10"
    :label="title"
    @close="(r) => cancel(r === 'escape')"
  >
    <span data-part="arrow" aria-hidden="true" />
    <div data-part="question">
      <ArIcon :name="icon" data-part="icon" :data-tone="tone" />
      <strong data-part="title">{{ title }}</strong>
    </div>
    <p v-if="description" data-part="description">{{ description }}</p>
    <div data-part="footer">
      <ArButton size="sm" tone="secondary" @click="cancel()">{{ cancelText }}</ArButton>
      <ArButton size="sm" :tone="okTone" @click="ok">{{ okText }}</ArButton>
    </div>
  </ArFloat>
</template>
