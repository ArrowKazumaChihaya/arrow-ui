<script setup lang="ts">
/**
 * ArZoomControl 1.0 — −／＋ で列の幅・図の大きさを変える組（今の値を真ん中に出す）。
 * シフト表（ArShiftGrid・ArShiftViewTable）と組織図（ArOrgChart）の拡大縮小はこれ1つ。値は使う側が持ち、out・in を受けて変える。
 * ボタンの名前は吹き出し（ArTooltip と同じ形）と読み上げで伝える。
 */
import { ref } from "vue";
import ArIcon from "./ArIcon.vue";
import ArHoverTip from "../internal/ArHoverTip.vue";
import type { ArZoomControlProps } from "./ArZoomControl.contract";

const props = withDefaults(defineProps<ArZoomControlProps>(), {
  outDisabled: false,
  inDisabled: false,
  disabled: false,
  variant: "box",
  size: "md",
  label: "拡大・縮小",
  outLabel: "小さく",
  inLabel: "大きく",
});
const emit = defineEmits<{ out: [event: MouseEvent]; in: [event: MouseEvent] }>();
const rootEl = ref<HTMLElement | null>(null);
</script>

<template>
  <div
    ref="rootEl"
    data-ar="zoom-control"
    data-part="root"
    :data-variant="variant"
    :data-size="size"
    :data-state="disabled ? 'disabled' : undefined"
    role="group"
    :aria-label="label"
  >
    <button
      type="button"
      data-part="zoom-out"
      :aria-label="outLabel"
      :data-tip="outLabel"
      :disabled="disabled || props.outDisabled"
      @click="emit('out', $event)"
    >
      <ArIcon line name="minus" size="sm" />
    </button>
    <span data-part="zoom-value" aria-live="polite">{{ value }}</span>
    <button
      type="button"
      data-part="zoom-in"
      :aria-label="inLabel"
      :data-tip="inLabel"
      :disabled="disabled || props.inDisabled"
      @click="emit('in', $event)"
    >
      <ArIcon line name="plus" size="sm" />
    </button>
    <ArHoverTip :root="rootEl" />
  </div>
</template>
