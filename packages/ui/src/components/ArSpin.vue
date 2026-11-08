<script setup lang="ts">
/**
 * ArSpin 1.0 — テーマ色の回る輪。中身（default slot）を包むと、読み込み中は中身の上に白い幕と輪を重ねる。
 */
import type { ArSpinProps } from "./ArSpin.contract";
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = withDefaults(defineProps<ArSpinProps>(), { spinning: true, size: "md", tip: undefined, block: false, minHeight: undefined });
const content = ref<HTMLElement | null>(null);
let suspendedFocus: HTMLElement | null = null;
watch(() => props.spinning, async (spinning) => {
  if (spinning) {
    const active = document.activeElement;
    suspendedFocus = active instanceof HTMLElement && content.value?.contains(active) ? active : null;
    return;
  }
  const target = suspendedFocus;
  suspendedFocus = null;
  await nextTick();
  if (props.spinning || !target?.isConnected || !content.value?.contains(target)) return;
  // Applying inert removes keyboard focus. Restore it only if the user has not
  // moved to another control and the original control is still available.
  if (document.activeElement !== document.body && document.activeElement !== null) return;
  if (target.closest('[inert], [hidden]') || target.matches(':disabled') || !target.getClientRects().length) return;
  target.focus({ preventScroll: true });
});
onBeforeUnmount(() => { suspendedFocus = null; });
</script>

<template>
  <div v-if="$slots.default" data-ar="spin" data-part="root" data-wrap :data-size="size" :aria-busy="spinning">
    <div ref="content" data-part="content" :inert="spinning || undefined"><slot /></div>
    <div v-if="spinning" data-part="mask" role="status" :aria-label="tip ?? '読み込み中'">
      <span data-part="spinner" aria-hidden="true" />
      <span v-if="tip" data-part="tip">{{ tip }}</span>
    </div>
  </div>
  <span v-else-if="spinning" data-ar="spin" data-part="root" :data-size="size" :data-block="block || undefined" :style="{ minHeight }" role="status" :aria-label="tip ?? '読み込み中'">
    <span data-part="spinner" aria-hidden="true" />
    <span v-if="tip" data-part="tip">{{ tip }}</span>
  </span>
</template>
