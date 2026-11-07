<script setup lang="ts">
/**
 * ArPdfViewer 1.0 — PDF の表示（ページ送り・拡大縮小・何人目か）。中身は製品が渡すページの画像・iframe の src・page slot の HTML。
 * toolbar を消すと見本の枠（灰色の地に白い紙）だけ。
 * キーボード：紙の部分にフォーカスして ←→ PageUp PageDown でページ、+ − で大きさ、0 で 100%。
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import { useDesignForm } from "../provider/context";
import type { ArPdfViewerLabels, ArPdfViewerProps } from "./ArPdfViewer.contract";

const props = withDefaults(defineProps<ArPdfViewerProps>(), {
  pages: () => [],
  src: undefined,
  pageCount: undefined,
  page: undefined,
  zoom: undefined,
  zoomSteps: () => [70, 85, 100, 125, 150],
  people: undefined,
  pageLabel: undefined,
  toolbar: true,
  paperWidth: "560px",
  fitWidth: undefined,
  paperMinHeight: undefined,
  height: undefined,
  label: undefined,
  labels: () => ({}),
});
const emit = defineEmits<{ "update:page": [page: number]; "update:zoom": [zoom: number] }>();
defineSlots<{ page?: (p: { page: number; width: number | undefined }) => unknown; "toolbar-end"?: () => unknown }>();

const L = computed<ArPdfViewerLabels>(() => ({
  prev: "前のページ",
  next: "次のページ",
  zoomIn: "大きく",
  zoomOut: "小さく",
  zoomGroup: "大きさ",
  page: "{page} / {count}",
  person: "{name}（{n}人目）",
  pageAlt: "{n}ページ目",
  ...props.labels,
}));
const bar = useDesignForm<"full" | "pager">("ArPdfViewer", "bar", "full");

const count = computed(() => Math.max(1, props.pages.length || props.pageCount || 1));
const innerPage = ref(1);
const cur = computed(() => Math.min(count.value, Math.max(1, props.page ?? innerPage.value)));
function go(n: number) {
  const v = Math.min(count.value, Math.max(1, n));
  if (v === cur.value) return;
  innerPage.value = v;
  emit("update:page", v);
}
const innerZoom = ref(100);
const z = computed(() => props.zoom ?? innerZoom.value);
function setZoom(v: number) {
  innerZoom.value = v;
  emit("update:zoom", v);
}
const steps = computed(() => [...props.zoomSteps].sort((a, b) => a - b));
const zoomIn = () => {
  const n = steps.value.find((s) => s > z.value);
  if (n !== undefined) setZoom(n);
};
const zoomOut = () => {
  const n = [...steps.value].reverse().find((s) => s < z.value);
  if (n !== undefined) setZoom(n);
};
const canIn = computed(() => steps.value.some((s) => s > z.value));
const canOut = computed(() => steps.value.some((s) => s < z.value));

const who = computed(() => {
  if (props.pageLabel) return props.pageLabel(cur.value);
  const n = props.people?.[cur.value - 1];
  return n ? L.value.person.replace("{name}", n).replace("{n}", String(cur.value)) : "";
});
const counter = computed(() => L.value.page.replace("{page}", String(cur.value)).replace("{count}", String(count.value)));
const iframeSrc = computed(() => (props.src ? `${props.src.split("#")[0]}#page=${cur.value}&zoom=${z.value}` : undefined));
const img = computed(() => props.pages[cur.value - 1]);
const showBar = computed(() => props.toolbar && (bar.value === "full" || count.value > 1));
const toolbarElement = ref<HTMLElement | null>(null);
const viewport = ref<HTMLElement | null>(null);
const paper = ref<HTMLElement | null>(null);
const pageWidth = ref<number>();
const availableWidth = ref<number>();
const paperStyleWidth = computed(() => props.fitWidth && props.fitWidth > 0 && availableWidth.value
  ? `${Math.min(props.fitWidth, availableWidth.value)}px`
  : props.paperWidth);
let paperObserver: ResizeObserver | undefined;
watch([paper, viewport, () => props.fitWidth], ([element, container]) => {
  paperObserver?.disconnect();
  paperObserver = undefined;
  const measure = () => {
    if (props.fitWidth && container) {
      const style = getComputedStyle(container);
      const width = container.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
      availableWidth.value = width > 0 ? width : undefined;
    }
    // CSS layout width excludes zoom; consumers render once at this width and
    // the paper applies the requested magnification without double scaling.
    const width = element?.clientWidth;
    pageWidth.value = width && width > 0 ? width : undefined;
  };
  measure();
  if (element && typeof ResizeObserver !== "undefined") {
    paperObserver = new ResizeObserver(measure);
    paperObserver.observe(element);
    if (props.fitWidth && container) paperObserver.observe(container);
  }
}, { flush: "post" });
onBeforeUnmount(() => paperObserver?.disconnect());
watch([bar, showBar], async () => {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement) || !toolbarElement.value?.contains(active)) return;
  await nextTick();
  if (!active.isConnected && document.activeElement === document.body) viewport.value?.focus({ preventScroll: true });
});

function onKey(e: KeyboardEvent) {
  const m: Record<string, () => void> = {
    ArrowLeft: () => go(cur.value - 1),
    PageUp: () => go(cur.value - 1),
    ArrowRight: () => go(cur.value + 1),
    PageDown: () => go(cur.value + 1),
    "+": zoomIn,
    "=": zoomIn,
    "-": zoomOut,
    "0": () => setZoom(100),
  };
  const f = m[e.key];
  if (!f || e.ctrlKey || e.metaKey || e.altKey) return;
  e.preventDefault();
  f();
}
</script>

<template>
  <div
    data-ar="pdf-viewer"
    data-part="root"
    :data-bar="toolbar ? bar : 'none'"
    :data-source="src ? 'iframe' : pages.length ? 'image' : 'html'"
    role="region"
    :aria-label="label"
    :style="height ? { height } : undefined"
  >
    <div v-if="showBar" ref="toolbarElement" data-part="bar">
      <button type="button" data-part="prev" :aria-label="L.prev" :title="L.prev" :disabled="cur <= 1" @click="go(cur - 1)">
        <ArIcon :line="bar === 'full'" name="cl" />
      </button>
      <b data-part="counter" aria-live="polite">{{ counter }}</b>
      <button type="button" data-part="next" :aria-label="L.next" :title="L.next" :disabled="cur >= count" @click="go(cur + 1)">
        <ArIcon :line="bar === 'full'" name="cr" />
      </button>
      <template v-if="bar === 'full'">
        <span v-if="who" data-part="who">{{ who }}</span>
        <span data-part="spacer" />
        <slot name="toolbar-end" />
        <div data-part="zoom" role="group" :aria-label="L.zoomGroup">
          <button type="button" data-part="zoom-out" :aria-label="L.zoomOut" :title="L.zoomOut" :disabled="!canOut" @click="zoomOut">
            <ArIcon line name="minus" />
          </button>
          <span data-part="zoom-value" aria-live="polite">{{ z }}%</span>
          <button type="button" data-part="zoom-in" :aria-label="L.zoomIn" :title="L.zoomIn" :disabled="!canIn" @click="zoomIn">
            <ArIcon line name="plus" />
          </button>
        </div>
      </template>
    </div>
    <div ref="viewport" data-part="viewport" tabindex="0" :aria-label="counter" @keydown="onKey">
      <iframe v-if="src" data-part="frame" :src="iframeSrc" :title="label ?? counter" />
      <div
        v-else
        ref="paper"
        data-part="paper"
        :style="{ width: paperStyleWidth, minHeight: paperMinHeight, zoom: z / 100 }"
      >
        <img v-if="img" data-part="image" :src="img.src" :alt="img.alt ?? L.pageAlt.replace('{n}', String(cur))" draggable="false" />
        <slot v-else name="page" :page="cur" :width="pageWidth" />
      </div>
    </div>
  </div>
</template>
