<script setup lang="ts">
/**
 * ArDropdown 1.0 — 押すとメニュー。項目にアイコン・説明・見出し・区切り・危ない項目（赤）・使えない・鍵（権限なし）。
 * 押すもの：default slot（自由）か、label で「操作」ボタン（variant="ops"）・ArButton・Dropdown.Button（split）。
 * ↓ Enter Space で開き、メニューの中は ↑↓ で移る。Escape・外を押す・Tab で閉じ、押したものにフォーカスを戻す。
 */
import { computed, nextTick, ref, useSlots, watch } from "vue";
import ArFloat from "../internal/ArFloat.vue";
import ArMenuPanel from "../internal/ArMenuPanel.vue";
import ArIcon from "./ArIcon.vue";
import ArButton from "./ArButton.vue";
import ArCompact from "./ArCompact.vue";
import { useId } from "../provider/context";
import type { ArDropdownProps } from "./ArDropdown.contract";
import type { ArMenuItem } from "./ArMenu.contract";

const props = withDefaults(defineProps<ArDropdownProps>(), {
  items: () => [],
  open: undefined,
  label: undefined,
  icon: undefined,
  variant: "button",
  tone: "secondary",
  size: "md",
  placement: "bottom-start",
  width: undefined,
  disabled: false,
  closeOnSelect: true,
  moreLabel: "ほかの操作",
});
const emit = defineEmits<{ "update:open": [open: boolean]; select: [key: string, item: ArMenuItem]; click: [event: MouseEvent] }>();
const slots = useSlots();
const menuId = useId("ar-dd");
const anchor = ref<HTMLElement | null>(null);
const inner = ref(false);
const isOpen = computed(() => props.open ?? inner.value);
watch(
  () => props.open,
  (v) => v !== undefined && (inner.value = v),
);

function setOpen(v: boolean) {
  if (props.disabled && v) return;
  inner.value = v;
  emit("update:open", v);
}
/** 押したもの（フォーカスを戻す先）。 */
function triggerEl(): HTMLElement | null {
  const a = anchor.value;
  if (!a) return null;
  return a.querySelector<HTMLElement>('[aria-haspopup="menu"]') ?? a.querySelector<HTMLElement>("button,a,[tabindex]") ?? a;
}
function close(refocus: boolean) {
  setOpen(false);
  if (refocus) void nextTick(() => triggerEl()?.focus());
}
function toggle() {
  setOpen(!isOpen.value);
}
function onTriggerKeydown(e: KeyboardEvent) {
  if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !isOpen.value) {
    e.preventDefault();
    setOpen(true);
  }
}
function onSelect(key: string, item: ArMenuItem) {
  emit("select", key, item);
  if (props.closeOnSelect) close(true);
}
const attrs = computed(() => ({
  "aria-haspopup": "menu" as const,
  "aria-expanded": isOpen.value,
  "aria-controls": isOpen.value ? menuId : undefined,
}));
const custom = computed(() => !!slots.default);
const floatAnchor = computed(() => (props.variant === "split" && !custom.value ? (anchor.value?.querySelector<HTMLElement>('[data-ar="compact"]') ?? anchor.value) : anchor.value));
</script>

<template>
  <span
    ref="anchor"
    data-ar="dropdown"
    data-part="root"
    :data-variant="custom ? 'custom' : variant"
    :data-state="[isOpen && 'open', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
    @keydown="onTriggerKeydown"
  >
    <span v-if="custom" data-part="slot" @click="!disabled && toggle()"><slot :open="isOpen" :toggle="toggle" :attrs="attrs" /></span>
    <button
      v-else-if="variant === 'ops'"
      type="button"
      data-part="trigger"
      :disabled="disabled"
      v-bind="attrs"
      @click="toggle"
    >
      <ArIcon v-if="icon" :name="icon" data-part="icon" size="sm" />
      <span data-part="label">{{ label }}</span>
      <span data-part="caret"><ArIcon name="cd" size="sm" /></span>
    </button>
    <ArCompact v-else-if="variant === 'split'">
      <ArButton :tone="tone" :size="size" :icon="icon" :disabled="disabled" @click="emit('click', $event)">{{ label }}</ArButton>
      <ArButton :tone="tone" :size="size" icon="cd" :label="moreLabel" :disabled="disabled" v-bind="attrs" @click="toggle" />
    </ArCompact>
    <ArButton v-else :tone="tone" :size="size" :icon="icon" icon-end="cd" :disabled="disabled" v-bind="attrs" @click="toggle">{{ label }}</ArButton>
    <ArFloat
      :id="menuId"
      ar="dropdown-menu"
      :role="slots.content ? 'dialog' : 'menu'"
      :label="label"
      :open="isOpen"
      :anchor="floatAnchor"
      :placement="placement"
      :offset="6"
      match-width="min"
      @close="(r) => close(r === 'escape')"
    >
      <div v-if="slots.content" data-part="content" :style="width ? {width: `${width}px`} : undefined"><slot name="content" :close="() => close(true)" /></div>
      <ArMenuPanel v-else :items="items" :variant="custom ? 'custom' : variant" :style="width ? { width: `${width}px` } : undefined" @select="onSelect" @close="close(true)" />
    </ArFloat>
  </span>
</template>
