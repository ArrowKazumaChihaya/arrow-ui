<script setup lang="ts">
/**
 * ArEllipsis 1.0 — はみ出す文字を「…」で切る。切れているときだけ、指を置く・フォーカスで全文の吹き出しを出す。
 * 切れているときは Tab で止まれるようにし（キーボードでも全文を読める）、Escape で吹き出しを閉じる。
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import ArFloat from "../internal/ArFloat.vue";
import { useId } from "../provider/context";
import type { ArEllipsisProps } from "./ArEllipsis.contract";

const props = withDefaults(defineProps<ArEllipsisProps>(), { text: undefined, lines: 1, placement: "top" });
const tipId = useId("ar-ellipsis");
const root = ref<HTMLElement | null>(null);
const cut = ref(false);
const open = ref(false);
function measure() {
  const el = root.value;
  if (!el) return;
  cut.value = props.lines > 1 ? el.scrollHeight > el.clientHeight + 1 : el.scrollWidth > el.clientWidth + 1;
  if (!cut.value) open.value = false;
}
let ro: ResizeObserver | null = null;
onMounted(() => {
  measure();
  if (typeof ResizeObserver !== "undefined" && root.value) {
    ro = new ResizeObserver(measure);
    ro.observe(root.value);
  }
});
onBeforeUnmount(() => ro?.disconnect());
let timer = 0;
function show() {
  measure();
  if (!cut.value) return;
  clearTimeout(timer);
  timer = window.setTimeout(() => (open.value = true), 100);
}
function hide() {
  clearTimeout(timer);
  open.value = false;
}
const style = computed(() => ({
  ...(props.lines > 1 ? { "-webkit-line-clamp": String(props.lines) } : {}),
  maxWidth: typeof props.maxWidth === "number" ? `${props.maxWidth}px` : props.maxWidth,
}));
defineExpose({ measure });
</script>

<template>
  <span
    ref="root"
    data-ar="ellipsis"
    data-part="root"
    :data-lines="lines > 1 ? 'multi' : 'single'"
    :data-state="cut ? 'cut' : undefined"
    :style="style"
    :tabindex="cut ? 0 : undefined"
    :aria-describedby="open ? tipId : undefined"
    @pointerenter="show"
    @pointerleave="hide"
    @focus="show"
    @blur="hide"
  ><slot>{{ text }}</slot><ArFloat :id="tipId" :open="open" :anchor="root" ar="ellipsis-tip" :placement="placement" :offset="8" role="tooltip" :close-on-outside="true" @close="hide">
    <span data-part="text"><slot>{{ text }}</slot></span>
  </ArFloat></span>
</template>
