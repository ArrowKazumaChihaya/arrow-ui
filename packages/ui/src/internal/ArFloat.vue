<script setup lang="ts">
/**
 * 浮かぶものの入れ物（ライブラリの中だけで使う。製品には出さない）。
 * 基準の要素（anchor）の近くに置き、画面からはみ出すなら反対側へ返す。
 * Provider の出す先（scope="self" のときはデザインの範囲の中）へ出し、基準の要素のテーマ色を引き継ぐ。
 * 外を押す・Escape で close を出す（閉じるかは親が決める）。
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useArUi } from "../provider/context";
import { computePosition, type ArPlacement, type FloatPosition } from "./floating";

import { acquireOverlayLayer, releaseOverlayLayer } from "./overlay";

const props = withDefaults(
  defineProps<{
    open: boolean;
    anchor: HTMLElement | null;
    placement?: ArPlacement;
    offset?: number;
    /** 基準の要素と同じ幅にする（セレクトのプルダウンなど）。"min" は「少なくとも同じ幅」。 */
    matchWidth?: boolean | "min";
    /** 外を押したとき close を出すか。 */
    closeOnOutside?: boolean;
    /** 部品の名前（data-ar）。デザインの CSS はこれで見た目を当てる。 */
    ar: string;
    role?: string;
    id?: string;
    label?: string;
  }>(),
  { placement: "bottom-start", offset: 4, matchWidth: false, closeOnOutside: true, role: undefined, id: undefined, label: undefined },
);
const emit = defineEmits<{ close: [reason: "outside" | "escape"] }>();

const ui = useArUi();
const target = computed(() => ui?.portal.value ?? "body");
const panel = ref<HTMLElement | null>(null);
const pos = ref<FloatPosition | null>(null);
const width = ref<number | null>(null);
const palette = ref<string | undefined>(undefined);
const layer = ref<number | undefined>(undefined);
const layerId = Symbol("float");

function place() {
  if (!props.open || !props.anchor || !panel.value) return;
  const a = props.anchor.getBoundingClientRect();
  if (props.matchWidth) width.value = a.width;
  const p = panel.value.getBoundingClientRect();
  pos.value = computePosition(a, { width: p.width, height: p.height }, props.placement, props.offset);
}

let raf = 0;
const schedule = () => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(place);
};
function onPointer(e: PointerEvent) {
  const t = e.target as Node;
  if (panel.value?.contains(t) || props.anchor?.contains(t)) return;
  if (props.closeOnOutside) emit("close", "outside");
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    e.stopPropagation();
    emit("close", "escape");
  }
}
let ro: ResizeObserver | null = null;
function bind(on: boolean) {
  const fn = on ? "addEventListener" : "removeEventListener";
  window[fn]("scroll", schedule, true);
  window[fn]("resize", schedule);
  document[fn]("pointerdown", onPointer as EventListener, true);
  document[fn]("keydown", onKey as EventListener, true);
  if (on && typeof ResizeObserver !== "undefined" && panel.value) {
    ro = new ResizeObserver(schedule);
    ro.observe(panel.value);
  } else {
    ro?.disconnect();
    ro = null;
  }
}

watch(
  () => props.open,
  async (o) => {
    if (o) {
      layer.value = acquireOverlayLayer(layerId, 1060);
      palette.value = (props.anchor?.closest("[data-ar-palette]") as HTMLElement | null)?.dataset.arPalette;
      pos.value = null;
      await nextTick();
      place();
      bind(true);
    } else {
      releaseOverlayLayer(layerId);
      bind(false);
    }
  },
  { immediate: true },
);
onBeforeUnmount(() => {
  releaseOverlayLayer(layerId);
  bind(false);
  cancelAnimationFrame(raf);
});
defineExpose({ place, panel });

const style = computed(() => ({
  zIndex: layer.value,
  top: `${pos.value?.top ?? -9999}px`,
  left: `${pos.value?.left ?? -9999}px`,
  width: props.matchWidth === true && width.value ? `${width.value}px` : undefined,
  minWidth: props.matchWidth === "min" && width.value ? `${width.value}px` : undefined,
  "--ar-float-arrow": pos.value ? `${pos.value.arrow}px` : undefined,
  visibility: pos.value ? undefined : ("hidden" as const),
}));
</script>

<template>
  <Teleport :to="target" :disabled="!open" defer>
    <div
      v-if="open"
      :id="id"
      ref="panel"
      data-ar-float
      :data-ar="ar"
      data-part="root"
      :data-placement="pos?.placement ?? placement"
      :data-ar-palette="palette"
      :role="role"
      :aria-label="label"
      :style="style"
    >
      <slot />
    </div>
  </Teleport>
</template>
