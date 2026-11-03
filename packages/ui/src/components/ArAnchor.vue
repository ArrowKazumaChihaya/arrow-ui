<script setup lang="ts">
/**
 * ArAnchor 1.0 — 長いページ（社員情報のフォームなど）の目次。押すとその場所へスクロールし、今いるところはテーマ色の線と文字。
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { ArAnchorProps } from "./ArAnchor.contract";

const props = withDefaults(defineProps<ArAnchorProps>(), {
  modelValue: undefined,
  direction: "vertical",
  container: undefined,
  offset: 0,
  label: "目次",
});
const emit = defineEmits<{ "update:modelValue": [key: string]; click: [key: string, event: MouseEvent] }>();
const inner = ref<string | undefined>(props.modelValue);
watch(
  () => props.modelValue,
  (v) => (inner.value = v),
);
const current = computed(() => inner.value ?? props.items[0]?.key);
let lock = 0;

function box(): HTMLElement | Window {
  if (!props.container) return window;
  if (typeof props.container === "string") return document.querySelector<HTMLElement>(props.container) ?? window;
  return props.container;
}
function targetOf(href: string): HTMLElement | null {
  try {
    return href.startsWith("#") ? document.querySelector<HTMLElement>(`#${CSS.escape(href.slice(1))}`) : null;
  } catch {
    return null;
  }
}
function setCurrent(key: string) {
  if (inner.value === key) return;
  inner.value = key;
  emit("update:modelValue", key);
}
function onScroll() {
  if (Date.now() < lock) return;
  const b = box();
  const top = b instanceof Window ? 0 : b.getBoundingClientRect().top;
  let found: string | undefined;
  for (const it of props.items) {
    const t = targetOf(it.href);
    if (t && t.getBoundingClientRect().top - top <= props.offset + 5) found = it.key;
  }
  const atEnd = b instanceof Window ? window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2 : b.scrollTop + b.clientHeight >= b.scrollHeight - 2;
  if (atEnd) found = props.items.at(-1)?.key ?? found;
  if (found) setCurrent(found);
}
function go(key: string, href: string, e: MouseEvent) {
  emit("click", key, e);
  const t = targetOf(href);
  if (!t) return;
  e.preventDefault();
  const b = box();
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const behavior = reduce ? "auto" : "smooth";
  if (b instanceof Window) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - props.offset, behavior });
  else b.scrollTo({ top: t.getBoundingClientRect().top - b.getBoundingClientRect().top + b.scrollTop - props.offset, behavior });
  lock = Date.now() + 600;
  setCurrent(key);
  if (!t.hasAttribute("tabindex")) t.setAttribute("tabindex", "-1");
  t.focus({ preventScroll: true });
}
let bound: HTMLElement | Window | null = null;
onMounted(() => {
  bound = box();
  bound.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
onBeforeUnmount(() => bound?.removeEventListener("scroll", onScroll));
</script>

<template>
  <nav data-ar="anchor" data-part="root" :data-direction="direction" :aria-label="label">
    <a
      v-for="it in items"
      :key="it.key"
      data-part="link"
      :href="it.href"
      :data-level="it.level ?? 1"
      :data-state="it.key === current ? 'active' : undefined"
      :aria-current="it.key === current ? 'location' : undefined"
      @click="go(it.key, it.href, $event)"
    >{{ it.label }}</a>
  </nav>
</template>
