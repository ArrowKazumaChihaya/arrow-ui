<script setup lang="ts">
/**
 * ArTitle 1.0 — 見出し（h1〜h5）。文書の段に合わせて level を選ぶ。
 */
import { ref } from "vue";
import type { ArTitleProps } from "./ArTitle.contract";

withDefaults(defineProps<ArTitleProps>(), { level: 1, type: undefined, ellipsis: false });
const el = ref<HTMLElement | null>(null);
/** 切れているときだけ全文を吹き出し（title）で出す。 */
function onEnter() {
  const e = el.value;
  if (!e) return;
  if (e.scrollWidth > e.clientWidth) e.title = e.textContent?.trim() ?? "";
  else e.removeAttribute("title");
}
</script>

<template>
  <component
    :is="`h${level}`"
    ref="el"
    data-ar="title"
    data-part="root"
    :data-level="level"
    :data-type="type"
    :data-ellipsis="ellipsis || undefined"
    @mouseenter="ellipsis && onEnter()"
  ><slot /></component>
</template>
