<script setup lang="ts">
/**
 * ArToast 1.0 — 操作のあと画面の下の真ん中に出る黒い帯（.toast）。チェックの印＋言葉＋「元に戻す」「閉じる」。
 * シフト画面で「〜を変更しました」と知らせるときに使う。上に短く出すだけなら useArMessage()。
 */
import { onBeforeUnmount, watch, type PropType } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArToastProps } from "./ArToast.contract";

// icon は ArIconName | false。型の宣言だと実行時の型が Boolean だけになるため、実行時の宣言で書く（型は契約と同じ）。
const props = defineProps({
  open: { type: Boolean, required: true },
  message: { type: String, default: undefined },
  icon: { type: [String, Boolean] as PropType<ArToastProps["icon"]>, default: "check" },
  undoText: { type: String, default: undefined },
  closeText: { type: String, default: "閉じる" },
  duration: { type: Number, default: 6 },
  offset: { type: Number, default: undefined },
  contained: { type: Boolean, default: false },
});
const emit = defineEmits<{ "update:open": [open: boolean]; close: []; undo: [] }>();

let timer: ReturnType<typeof setTimeout> | undefined;
let left = 0;
let at = 0;
function stop() {
  clearTimeout(timer);
  timer = undefined;
}
function start(ms: number) {
  stop();
  if (ms <= 0) return;
  left = ms;
  at = Date.now();
  timer = setTimeout(close, ms);
}
function pause() {
  if (!timer) return;
  stop();
  left = Math.max(0, left - (Date.now() - at));
}
function resume() {
  if (props.open && props.duration > 0 && !timer && left > 0) start(left);
}
function close() {
  stop();
  emit("update:open", false);
  emit("close");
}
function undo() {
  emit("undo");
  close();
}
watch(
  () => [props.open, props.message, props.duration] as const,
  ([open]) => (open ? start(props.duration * 1000) : stop()),
  { immediate: true },
);
onBeforeUnmount(stop);
</script>

<template>
  <Transition name="ar-toast">
    <div
      v-if="open"
      data-ar="toast"
      data-part="root"
      role="status"
      aria-live="polite"
      :data-contained="contained || undefined"
      :style="offset !== undefined ? { bottom: `${offset}px` } : undefined"
      @mouseenter="pause"
      @mouseleave="resume"
      @focusin="pause"
      @focusout="resume"
    >
      <ArIcon v-if="icon" line :name="icon" data-part="icon" />
      <span data-part="text"><slot>{{ message }}</slot></span>
      <button v-if="undoText" type="button" data-part="undo" @click="undo">{{ undoText }}</button>
      <button v-if="closeText" type="button" data-part="close" @click="close">{{ closeText }}</button>
    </div>
  </Transition>
</template>
