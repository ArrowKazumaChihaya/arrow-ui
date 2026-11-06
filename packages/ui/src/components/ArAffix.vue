<script setup lang="ts">
/**
 * ArAffix 1.0 — スクロールしても上（または下）に残る操作の帯（「3件を選んでいます［まとめて承認］」など）。
 * 一番近いスクロールする箱の中で張り付く（position: sticky）。張り付いている間は data-state="affixed"。
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { ArAffixProps } from "./ArAffix.contract";

const props = withDefaults(defineProps<ArAffixProps>(), { justify: "start", offsetTop: 0, offsetBottom: undefined, bandWhenStuck: false });
const emit = defineEmits<{ change: [affixed: boolean] }>();
const el = ref<HTMLElement | null>(null);
const affixed = ref(false);
const bottom = computed(() => props.offsetBottom !== undefined);
const style = computed(() => (bottom.value ? { bottom: `max(var(--ar-affix-bottom-inset, 0px), ${props.offsetBottom}px)` } : { top: `${props.offsetTop}px` }));

const isWin = (x: unknown): x is Window => x === window;
function scroller(node: HTMLElement | null): HTMLElement | Window {
  for (let p = node?.parentElement; p; p = p.parentElement) {
    const o = getComputedStyle(p).overflowY;
    if (o === "auto" || o === "scroll") return p;
  }
  return window;
}
let target: HTMLElement | Window | null = null;
function check() {
  const e = el.value;
  if (!e || !target) return;
  const r = e.getBoundingClientRect();
  const box = isWin(target) ? { top: 0, bottom: window.innerHeight } : target.getBoundingClientRect();
  const now = bottom.value
    ? Math.abs(box.bottom - (parseFloat(getComputedStyle(e).bottom) || props.offsetBottom || 0) - r.bottom) < 1 && (isWin(target) ? document.documentElement.scrollHeight > window.innerHeight : target.scrollHeight > target.clientHeight)
    : Math.abs(r.top - box.top - props.offsetTop) < 1 && (isWin(target) ? window.scrollY > 0 : target.scrollTop > 0);
  if (now !== affixed.value) {
    affixed.value = now;
    emit("change", now);
  }
}
onMounted(() => {
  target = scroller(el.value);
  target.addEventListener("scroll", check, { passive: true });
  window.addEventListener("resize", check);
  check();
});
onBeforeUnmount(() => {
  target?.removeEventListener("scroll", check);
  window.removeEventListener("resize", check);
});
</script>

<template>
  <div
    ref="el"
    data-ar="affix"
    data-part="root"
    :data-position="bottom ? 'bottom' : 'top'"
    :data-justify="justify"
    :data-band="bandWhenStuck ? 'stuck' : 'always'"
    :data-state="affixed ? 'affixed' : undefined"
    :style="style"
  ><slot /></div>
</template>
