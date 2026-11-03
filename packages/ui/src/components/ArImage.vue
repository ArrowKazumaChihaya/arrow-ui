<script setup lang="ts">
/**
 * ArImage 1.0 — 角丸の画像。乗せる・フォーカスで暗い幕に「プレビュー」、押すと大きく見る（拡大・縮小・元の大きさ・閉じる）。
 * 読み込めないときは灰色の箱に画像の印。プレビューは Escape で閉じ、+ / - / 0 で拡大・縮小・元に戻す。
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import ArGlyph from "../internal/ArGlyph.vue";
import { useArUi, useId } from "../provider/context";
import type { ArImageProps } from "./ArImage.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArImageProps>(), {
  src: undefined,
  width: undefined,
  height: undefined,
  fit: "cover",
  preview: true,
  previewSrc: undefined,
  previewOpen: undefined,
  fallback: undefined,
  labels: () => ({ preview: "プレビュー", zoomIn: "拡大", zoomOut: "縮小", reset: "元の大きさ", close: "閉じる", error: "画像を読み込めません" }),
});
const emit = defineEmits<{ "update:previewOpen": [open: boolean]; error: [event: Event] }>();

const id = useId("ar-image");
const ui = useArUi();
const target = computed(() => ui?.portal.value ?? "body");

/* 読み込み */
const failed = ref<"none" | "src" | "all">("none");
const loaded = ref(false);
watch(
  () => [props.src, props.fallback],
  () => {
    failed.value = props.src ? "none" : props.fallback ? "src" : "all";
    loaded.value = false;
  },
  { immediate: true },
);
const shownSrc = computed(() => (failed.value === "none" ? props.src : failed.value === "src" ? props.fallback : undefined));
function onError(e: Event) {
  failed.value = failed.value === "none" && props.fallback ? "src" : "all";
  emit("error", e);
}
const broken = computed(() => !shownSrc.value);
const canPreview = computed(() => props.preview && !broken.value);

const size = (v: number | string | undefined) => (v === undefined ? undefined : typeof v === "number" ? `${v}px` : v);
const boxStyle = computed(() => ({ width: size(props.width), height: size(props.height) }));
const state = computed(() => [broken.value && "error", loaded.value && "loaded", canPreview.value && "previewable"].filter(Boolean).join(" ") || undefined);

/* プレビュー */
const inner = ref(false);
const open = computed(() => canPreview.value && (props.previewOpen ?? inner.value));
const scale = ref(1);
const root = ref<HTMLElement | null>(null);
const viewer = ref<HTMLElement | null>(null);
function setOpen(v: boolean) {
  inner.value = v;
  emit("update:previewOpen", v);
}
const STEPS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
function zoom(dir: 1 | -1) {
  const i = STEPS.findIndex((s) => s >= scale.value - 1e-6);
  const cur = i < 0 ? STEPS.length - 1 : i;
  const exact = Math.abs(STEPS[cur]! - scale.value) < 1e-6;
  const next = dir > 0 ? (exact ? cur + 1 : cur) : cur - 1;
  scale.value = STEPS[Math.min(STEPS.length - 1, Math.max(0, next))]!;
}
function onWheel(e: WheelEvent) {
  e.preventDefault();
  zoom(e.deltaY < 0 ? 1 : -1);
}
function onViewerKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    e.stopPropagation();
    setOpen(false);
  } else if (e.key === "+" || e.key === "=") zoom(1);
  else if (e.key === "-") zoom(-1);
  else if (e.key === "0") scale.value = 1;
  else if (e.key === "Tab" && viewer.value) {
    const list = Array.from(viewer.value.querySelectorAll<HTMLElement>("button:not([disabled])"));
    const first = list[0];
    const last = list.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }
}
watch(open, async (v) => {
  if (typeof document === "undefined") return;
  if (v) {
    scale.value = 1;
    document.documentElement.setAttribute("data-ar-modal-open", "");
    await nextTick();
    viewer.value?.querySelector<HTMLElement>('[data-part="close"]')?.focus();
  } else {
    document.documentElement.removeAttribute("data-ar-modal-open");
    root.value?.focus?.();
  }
});
onBeforeUnmount(() => open.value && document.documentElement.removeAttribute("data-ar-modal-open"));
</script>

<template>
  <component
    :is="canPreview ? 'button' : 'span'"
    ref="root"
    v-bind="$attrs"
    data-ar="image"
    data-part="root"
    :data-fit="fit"
    :data-state="state"
    :type="canPreview ? 'button' : undefined"
    :role="broken ? 'img' : undefined"
    :aria-label="broken ? `${alt ? alt + '：' : ''}${labels.error}` : canPreview ? `${alt ? alt + '（' : ''}${labels.preview}${alt ? '）' : ''}` : undefined"
    :aria-haspopup="canPreview ? 'dialog' : undefined"
    :style="boxStyle"
    @click="canPreview && setOpen(true)"
  >
    <img v-if="shownSrc" :key="shownSrc" data-part="img" :src="shownSrc" :alt="canPreview ? '' : alt" @load="loaded = true" @error="onError" />
    <span v-else data-part="placeholder" aria-hidden="true"><ArIcon name="image" /></span>
    <span v-if="canPreview" data-part="mask" aria-hidden="true"><ArIcon name="zoom" size="sm" />{{ labels.preview }}</span>
  </component>
  <Teleport :to="target" :disabled="!open" defer>
    <div
      v-if="open"
      :id="id"
      ref="viewer"
      data-ar="image"
      data-part="viewer"
      role="dialog"
      aria-modal="true"
      :aria-label="alt || labels.preview"
      @keydown="onViewerKey"
    >
      <div data-part="scrim" aria-hidden="true" @click="setOpen(false)" />
      <div data-part="stage" @click.self="setOpen(false)" @wheel="onWheel">
        <img data-part="picture" :src="previewSrc ?? shownSrc" :alt="alt" :style="{ transform: `scale(${scale})` }" />
      </div>
      <button type="button" data-part="close" :aria-label="labels.close" @click="setOpen(false)"><ArIcon name="x" /></button>
      <div data-part="toolbar">
        <button type="button" data-part="tool" :aria-label="labels.zoomOut" :disabled="scale <= 0.25" aria-keyshortcuts="-" @click="zoom(-1)">
          <ArGlyph name="zoom-out" />
        </button>
        <button type="button" data-part="scale" :aria-label="labels.reset" aria-keyshortcuts="0" @click="scale = 1">{{ Math.round(scale * 100) }}%</button>
        <button type="button" data-part="tool" :aria-label="labels.zoomIn" :disabled="scale >= 4" aria-keyshortcuts="+" @click="zoom(1)">
          <ArIcon name="zoom" />
        </button>
      </div>
    </div>
  </Teleport>
</template>
