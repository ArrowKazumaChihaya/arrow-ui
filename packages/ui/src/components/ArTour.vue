<script setup lang="ts">
/**
 * ArTour 1.0 — 初めての人への案内。指す要素のまわりを残して暗い幕をかけ、白いカードで説明する。
 * 下に今どこかの点（今はテーマ色）と［前へ］［次へ（2/3）］。Escape で閉じ、Tab はカードの中で回る。閉じると元の場所へフォーカスを戻す。
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import ArButton from "./ArButton.vue";
import ArIcon from "./ArIcon.vue";
import ArFloat from "../internal/ArFloat.vue";
import { useArUi, useDesignForm, useId } from "../provider/context";
import type { ArTourProps, ArTourStep } from "./ArTour.contract";

const props = withDefaults(defineProps<ArTourProps>(), {
  current: undefined,
  mask: true,
  gap: 4,
  closable: false,
  labels: () => ({ prev: "前へ", next: "次へ", finish: "完了", close: "閉じる" }),
});
/** 「次へ」の後ろの数（デザインが選ぶ）：count＝「次へ（2/3）」、none＝「次へ」だけ（antd と同じ。どこにいるかは下の点で分かる）。 */
const nextCount = useDesignForm<"count" | "none">("ArTour", "nextCount", "count");
const emit = defineEmits<{ "update:open": [open: boolean]; "update:current": [index: number]; finish: []; close: [] }>();
defineSlots<{ default?: (p: { step: ArTourStep; index: number; total: number }) => unknown }>();

const id = useId("ar-tour");
const ui = useArUi();
const portal = computed(() => ui?.portal.value ?? "body");
const inner = ref(0);
const index = computed(() => Math.min(Math.max(0, props.current ?? inner.value), Math.max(0, props.steps.length - 1)));
const step = computed<ArTourStep | undefined>(() => props.steps[index.value]);
const last = computed(() => index.value >= props.steps.length - 1);

function setIndex(i: number) {
  inner.value = i;
  emit("update:current", i);
}
function close() {
  emit("update:open", false);
  emit("close");
}
function next() {
  if (last.value) {
    emit("finish");
    close();
  } else setIndex(index.value + 1);
}
const prev = () => index.value > 0 && setIndex(index.value - 1);

/* 指す要素と、その場所 */
function resolve(t: ArTourStep["target"]): HTMLElement | null {
  if (!t || typeof document === "undefined") return null;
  if (typeof t === "string") return document.querySelector<HTMLElement>(t);
  if (typeof t === "function") return t();
  return t;
}
const target = ref<HTMLElement | null>(null);
const rect = ref<{ top: number; left: number; width: number; height: number } | null>(null);
const spot = ref<HTMLElement | null>(null);
const float = ref<InstanceType<typeof ArFloat> | null>(null);
const palette = ref<string | undefined>(undefined);
function measure() {
  const el = target.value;
  if (!el) {
    rect.value = null;
  } else {
    const r = el.getBoundingClientRect();
    const g = props.gap;
    rect.value = { top: r.top - g, left: r.left - g, width: r.width + g * 2, height: r.height + g * 2 };
  }
  void nextTick(() => float.value?.place());
}
let raf = 0;
const schedule = () => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(measure);
};
function bind(on: boolean) {
  const fn = on ? "addEventListener" : "removeEventListener";
  window[fn]("scroll", schedule, true);
  window[fn]("resize", schedule);
}

/* 開く・移る */
const panel = ref<HTMLElement | null>(null);
let returnTo: HTMLElement | null = null;
watch(
  () => [props.open, index.value, step.value?.target] as const,
  async ([open], old) => {
    if (typeof document === "undefined") return;
    const wasOpen = old?.[0] ?? false;
    if (!open) {
      if (wasOpen) {
        bind(false);
        returnTo?.focus?.();
        returnTo = null;
      }
      return;
    }
    if (!wasOpen) {
      returnTo = document.activeElement as HTMLElement | null;
      bind(true);
    }
    target.value = resolve(step.value?.target);
    palette.value = (target.value?.closest("[data-ar-palette]") as HTMLElement | null)?.dataset.arPalette;
    target.value?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    measure();
    await nextTick();
    requestAnimationFrame(() => {
      measure();
      panel.value?.querySelector<HTMLElement>('[data-part="actions"] [data-ar="button"]:last-child')?.focus({ preventScroll: true });
    });
  },
  { immediate: true },
);
onBeforeUnmount(() => {
  bind(false);
  cancelAnimationFrame(raf);
});

function onKey(e: KeyboardEvent) {
  if (e.key === "ArrowRight" && !(e.target as HTMLElement).closest("input,textarea")) next();
  else if (e.key === "ArrowLeft" && !(e.target as HTMLElement).closest("input,textarea")) prev();
  if (e.key !== "Tab" || !panel.value) return;
  const list = Array.from(panel.value.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])'));
  const first = list[0];
  const lastEl = list.at(-1);
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    lastEl?.focus();
  } else if (!e.shiftKey && document.activeElement === lastEl) {
    e.preventDefault();
    first?.focus();
  }
}

const spotStyle = computed(() =>
  rect.value
    ? { top: `${rect.value.top}px`, left: `${rect.value.left}px`, width: `${rect.value.width}px`, height: `${rect.value.height}px` }
    : { top: "38%", left: "50%", width: "0px", height: "0px" },
);
const placement = computed(() => (rect.value ? (step.value?.placement ?? "bottom-start") : "bottom"));
</script>

<template>
  <Teleport :to="portal" :disabled="!open" defer>
    <div v-if="open" data-ar="tour" data-part="overlay" :data-mask="mask || undefined" :data-ar-palette="palette">
      <div ref="spot" data-part="spot" :data-target="rect ? undefined : 'none'" :style="spotStyle" @transitionend="float?.place()" />
    </div>
  </Teleport>
  <ArFloat
    ref="float"
    :open="open && !!step"
    :anchor="spot"
    :placement="placement"
    :offset="rect ? 12 : 0"
    :close-on-outside="false"
    ar="tour"
    @close="(r) => r === 'escape' && close()"
  >
    <div
      v-if="step"
      ref="panel"
      data-part="panel"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`${id}-title`"
      :aria-describedby="step.description ? `${id}-desc` : undefined"
      :data-target="rect ? undefined : 'none'"
      @keydown="onKey"
    >
      <span v-if="rect" data-part="arrow" aria-hidden="true" />
      <button v-if="closable" type="button" data-part="close" :aria-label="labels.close" @click="close"><ArIcon name="x" size="sm" /></button>
      <b :id="`${id}-title`" data-part="title">{{ step.title }}</b>
      <div v-if="step.description || $slots.default" :id="`${id}-desc`" data-part="description">
        <slot :step="step" :index="index" :total="steps.length">{{ step.description }}</slot>
      </div>
      <div data-part="footer">
        <span data-part="dots" aria-hidden="true">
          <i v-for="(_, i) in steps" :key="i" data-part="dot" :data-state="i === index ? 'current' : undefined" />
        </span>
        <span data-part="actions">
          <ArButton v-if="index > 0" tone="muted" size="sm" @click="prev">{{ labels.prev }}</ArButton>
          <ArButton tone="primary" size="sm" @click="next">
            {{ last ? labels.finish : nextCount === "none" ? labels.next : `${labels.next}（${index + 1}/${steps.length}）` }}
          </ArButton>
        </span>
      </div>
    </div>
  </ArFloat>
</template>
