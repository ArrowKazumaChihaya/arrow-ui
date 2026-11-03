<script setup lang="ts">
/**
 * ArPopover 1.0 — 白い吹き出し（見出し・中身・操作）。押す、または乗せると出る。
 * variant="cell" はシフトのマスに乗せたときの時間の表示（濃い地・矢印なし・行ごとに改行）。
 * 押して開いたときは吹き出しにフォーカスを移し、Escape・外を押す で閉じて基準の要素へ戻す。
 */
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from "vue";
import ArFloat from "../internal/ArFloat.vue";
import { delayed, setAria, triggerTarget } from "../internal/trigger";
import { useId } from "../provider/context";
import type { ArPopoverProps } from "./ArPopover.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArPopoverProps>(), {
  title: undefined,
  content: undefined,
  placement: undefined,
  trigger: undefined,
  variant: "card",
  open: undefined,
  delay: undefined,
  width: undefined,
  disabled: false,
  label: undefined,
});
const emit = defineEmits<{ "update:open": [open: boolean] }>();
const slots = useSlots();
const id = useId("ar-popover");
const wrap = ref<HTMLElement | null>(null);
/** 吹き出しが指す要素：包みの中の最初の操作できる要素（包みが親いっぱいに伸びても中身を指す）。 */
const anchorEl = computed(() => triggerTarget(wrap.value));
const panel = ref<HTMLElement | null>(null);
const inner = ref(false);
const isCell = computed(() => props.variant === "cell");
const mode = computed(() => props.trigger ?? (isCell.value ? "hover" : "click"));
const where = computed(() => props.placement ?? "bottom-start");
const shown = computed(() => !props.disabled && (props.open ?? inner.value));
const hasTitle = computed(() => !!props.title || !!slots.title);
const timer = delayed();
const widthStyle = computed(() =>
  props.width === undefined ? undefined : { width: typeof props.width === "number" ? `${props.width}px` : props.width },
);

function set(v: boolean) {
  timer.clear();
  if (inner.value === v) return;
  inner.value = v;
  emit("update:open", v);
}
function focusTrigger() {
  triggerTarget(wrap.value)?.focus?.();
}

/* 押して開く */
function onClick() {
  if (mode.value !== "click" || props.disabled) return;
  const next = !shown.value;
  set(next);
  if (next) void nextTick(() => panel.value?.focus({ preventScroll: true }));
}
function onClose(reason: "outside" | "escape") {
  set(false);
  if (reason === "escape") focusTrigger();
}
function onPanelKey(e: KeyboardEvent) {
  if (e.key !== "Tab" || !panel.value) return;
  // 吹き出しの中の端から Tab で出るときは閉じて基準の要素へ戻す
  const list = Array.from(panel.value.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'));
  const first = list[0];
  const last = list.at(-1);
  const active = document.activeElement;
  if ((e.shiftKey && (active === panel.value || active === first)) || (!e.shiftKey && (active === last || !list.length))) {
    e.preventDefault();
    set(false);
    focusTrigger();
  }
}

/* 乗せて開く */
const hoverDelay = computed(() => props.delay ?? (isCell.value ? 0 : 100));
function enter() {
  if (mode.value === "hover") timer.run(hoverDelay.value, () => set(true));
}
function leave() {
  if (mode.value === "hover") timer.run(isCell.value ? 0 : 100, () => set(false));
}
function onFocusIn() {
  if (mode.value === "hover") set(true);
}
function onFocusOut(e: FocusEvent) {
  if (mode.value !== "hover") return;
  const to = e.relatedTarget as Node | null;
  if (to && (panel.value?.contains(to) || wrap.value?.contains(to))) return;
  set(false);
}

watch(
  [shown, () => wrap.value],
  ([v]) => {
    const t = triggerTarget(wrap.value);
    if (isCell.value) {
      setAria(t, "aria-describedby", v ? id : undefined);
      return;
    }
    setAria(t, "aria-haspopup", "dialog");
    setAria(t, "aria-expanded", String(!!v));
    setAria(t, "aria-controls", v ? id : undefined);
  },
  { flush: "post" },
);
onBeforeUnmount(() => timer.clear());
</script>

<template>
  <span
    ref="wrap"
    v-bind="$attrs"
    data-ar="popover"
    data-part="trigger"
    :data-variant="variant"
    @click="onClick"
    @mouseenter="enter"
    @mouseleave="leave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <slot />
  </span>
  <ArFloat
    :open="shown"
    :anchor="anchorEl"
    :placement="where"
    :offset="isCell ? 4 : 10"
    :close-on-outside="mode === 'click'"
    ar="popover"
    @close="onClose"
  >
    <div
      :id="id"
      ref="panel"
      data-part="panel"
      :data-variant="variant"
      :role="isCell ? 'tooltip' : 'dialog'"
      :aria-labelledby="!isCell && hasTitle ? `${id}-title` : undefined"
      :aria-label="!isCell && !hasTitle ? label : undefined"
      :tabindex="isCell ? undefined : -1"
      :style="widthStyle"
      @mouseenter="mode === 'hover' && !isCell && timer.clear()"
      @mouseleave="leave"
      @keydown="onPanelKey"
      @focusout="onFocusOut"
    >
      <span v-if="!isCell" data-part="arrow" aria-hidden="true" />
      <div v-if="hasTitle" :id="`${id}-title`" data-part="title"><slot name="title">{{ title }}</slot></div>
      <div data-part="body"><slot name="content">{{ content }}</slot></div>
      <div v-if="$slots.footer" data-part="footer"><slot name="footer" :close="() => onClose('escape')" /></div>
    </div>
  </ArFloat>
</template>
