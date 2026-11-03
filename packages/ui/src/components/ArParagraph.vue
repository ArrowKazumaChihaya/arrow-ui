<script setup lang="ts">
/**
 * ArParagraph 1.0 — 段落（本文 13.5px・行の高さ1.75）。長い文は行数で切れる。
 */
import { computed, ref } from "vue";
import type { ArParagraphProps } from "./ArParagraph.contract";

const props = withDefaults(defineProps<ArParagraphProps>(), { type: undefined, size: "md", strong: false, ellipsis: false });
const el = ref<HTMLElement | null>(null);
const rows = computed(() => (props.ellipsis === true ? 1 : props.ellipsis || 0));
function onEnter() {
  const e = el.value;
  if (!e || !rows.value) return;
  if (e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth) e.title = e.textContent?.trim() ?? "";
  else e.removeAttribute("title");
}
</script>

<template>
  <p
    ref="el"
    data-ar="paragraph"
    data-part="root"
    :data-type="type"
    :data-size="size"
    :data-strong="strong || undefined"
    :data-ellipsis="rows ? (rows === 1 ? 'line' : 'rows') : undefined"
    :style="rows > 1 ? { '-webkit-line-clamp': rows } : undefined"
    @mouseenter="onEnter"
  ><slot /></p>
</template>
