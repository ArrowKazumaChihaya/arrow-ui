<script setup lang="ts">
/**
 * 1つだけ持って動かす吹き出し（ライブラリの中だけ）。
 * root の中の data-tip を持つ要素に乗せる・キーボードでフォーカスすると、その文字を ArTooltip と同じ形（[data-ar="tooltip"] の panel）で出す。
 * マス・帯が数百ある部品（ArShiftChart・ArShiftViewTable・ArCalendar など）で、要素ごとに吹き出しを持たずに済む。
 * 押している間（ドラッグ中）と disabled のときは出さない。ブラウザの title の代わり。
 * 形はデザインが決める（useDesignForm("ArTooltip", "cellTip")）：float＝吹き出し（remix）、title＝吹き出しを描かずに乗せた要素へ title を移す
 * （classic の今の ARROW のまま、OS の吹き出し）。
 */
import { computed, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import ArFloat from "./ArFloat.vue";
import { setAria } from "./trigger";
import { useDesignForm, useId } from "../provider/context";
import type { ArPlacement } from "./floating";

const props = withDefaults(
  defineProps<{ root: HTMLElement | null; disabled?: boolean; mode?: "float" | "title"; placement?: ArPlacement; delay?: number }>(),
  { disabled: false, mode: undefined, placement: "top", delay: 100 },
);
const formMode = useDesignForm<"float" | "title">("ArTooltip", "cellTip", "float");
const mode = computed(() => props.mode ?? formMode.value);
const id = useId("ar-hover-tip");
const anchor = shallowRef<HTMLElement | null>(null);
const text = ref("");
let pressed = false;
let timer: ReturnType<typeof setTimeout> | undefined;

function tipOf(t: EventTarget | null): HTMLElement | null {
  const el = (t as Element | null)?.closest?.("[data-tip]") as HTMLElement | null;
  return el && props.root?.contains(el) && el.dataset.tip ? el : null;
}
function hide() {
  clearTimeout(timer);
  if (anchor.value) setAria(anchor.value, "aria-describedby", undefined);
  anchor.value = null;
}
function show(el: HTMLElement, ms: number) {
  clearTimeout(timer);
  if (mode.value === "title") {
    el.title = el.dataset.tip ?? "";
    return;
  }
  timer = setTimeout(() => {
    if (pressed || props.disabled) return;
    if (anchor.value && anchor.value !== el) setAria(anchor.value, "aria-describedby", undefined);
    text.value = el.dataset.tip ?? "";
    anchor.value = el;
    setAria(el, "aria-describedby", id);
  }, ms);
}
function onOver(e: PointerEvent) {
  if (e.buttons) return;
  const el = tipOf(e.target);
  if (el) show(el, anchor.value ? 0 : props.delay);
  else hide();
}
function onOut(e: PointerEvent) {
  if (!tipOf(e.relatedTarget)) hide();
}
function onDown() {
  pressed = true;
  hide();
}
function onUp() {
  pressed = false;
}
function onFocus(e: FocusEvent) {
  const el = tipOf(e.target);
  let visible = true;
  try {
    visible = (e.target as HTMLElement).matches(":focus-visible");
  } catch {
    /* :focus-visible を知らない環境 */
  }
  if (el && visible) show(el, 0);
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") hide();
}

function bind(el: HTMLElement | null, on: boolean) {
  if (!el) return;
  const f = on ? el.addEventListener.bind(el) : el.removeEventListener.bind(el);
  f("pointerover", onOver as EventListener);
  f("pointerout", onOut as EventListener);
  f("pointerdown", onDown);
  f("focusin", onFocus as EventListener);
  f("focusout", hide);
  f("keydown", onKey as EventListener);
}
watch(
  () => props.root,
  (el, old) => {
    bind(old ?? null, false);
    bind(el, true);
  },
  { immediate: true },
);
watch(
  () => props.disabled,
  (d) => d && hide(),
);
if (typeof window !== "undefined") window.addEventListener("pointerup", onUp, true);
onBeforeUnmount(() => {
  bind(props.root, false);
  if (typeof window !== "undefined") window.removeEventListener("pointerup", onUp, true);
  hide();
});
defineExpose({ hide });
</script>

<template>
  <ArFloat
    v-if="mode === 'float'"
    :id="id"
    :open="!!anchor && !!text && !disabled"
    :anchor="anchor"
    :placement="placement"
    :offset="9"
    :close-on-outside="false"
    ar="tooltip"
    role="tooltip"
    @close="hide"
  >
    <span data-part="panel" data-tone="ink" data-hover-tip="">
      <span data-part="arrow" aria-hidden="true" />
      <span data-part="body">{{ text }}</span>
    </span>
  </ArFloat>
</template>
