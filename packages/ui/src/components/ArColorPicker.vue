<script setup lang="ts">
/**
 * ArColorPicker 1.0 — 色を選ぶ（イベント・パターンの色）。ふだんは決まった色の丸（ArColorSwatches）から選び、
 * 自由な色は「詳細」で色の面・色相の帯・HEX から選ぶ。選ぶたびにすぐ値が変わる。
 * キーボード：色の面は←→で鮮やかさ・↑↓で明るさ、色相の帯は←→、HEX は打って Enter。
 */
import { computed, nextTick, ref, watch } from "vue";
import ArFloat from "../internal/ArFloat.vue";
import ArColorSwatches from "./ArColorSwatches.vue";
import ArIcon from "./ArIcon.vue";
import { useId } from "../provider/context";
import { arEventColors, hexToHsv, hsvToHex, normalizeHex, type Hsv } from "./color";
import type { ArColorPickerProps } from "./ArColorPicker.contract";

const props = withDefaults(defineProps<ArColorPickerProps>(), {
  colors: () => arEventColors,
  custom: true,
  detailOpen: false,
  disabled: false,
  labels: () => ({ detail: "自由な色を選ぶ", hide: "決まった色だけにする", hex: "HEX", saturation: "鮮やかさと明るさ", hue: "色相", empty: "未選択" }),
});
const emit = defineEmits<{ "update:modelValue": [value: string]; "update:open": [open: boolean] }>();

const baseId = useId("ar-color");
const chip = ref<HTMLButtonElement | null>(null);
const open = ref(false);
const detail = ref(props.detailOpen);
const hsv = ref<Hsv>(hexToHsv(props.modelValue ?? props.colors[0]?.value ?? "#5591CE"));
const hexText = ref(props.modelValue ?? "");
watch(
  () => props.modelValue,
  (v) => {
    if (v && normalizeHex(v) !== hsvToHex(hsv.value)) hsv.value = hexToHsv(v);
    hexText.value = v ?? "";
  },
);
const hueColor = computed(() => hsvToHex({ h: hsv.value.h, s: 1, v: 1 }));

function setHsv(next: Hsv) {
  hsv.value = next;
  const hex = hsvToHex(next);
  hexText.value = hex;
  emit("update:modelValue", hex);
}
function setOpen(o: boolean) {
  if (o === open.value) return;
  open.value = o;
  emit("update:open", o);
  if (o) nextTick(() => requestAnimationFrame(() => document.querySelector<HTMLElement>(`#${baseId}-panel [tabindex="0"]`)?.focus()));
  else chip.value?.focus();
}

function drag(e: PointerEvent, apply: (x: number, y: number) => void) {
  const el = e.currentTarget as HTMLElement;
  const run = (ev: PointerEvent) => {
    const r = el.getBoundingClientRect();
    apply(Math.min(1, Math.max(0, (ev.clientX - r.left) / (r.width || 1))), Math.min(1, Math.max(0, (ev.clientY - r.top) / (r.height || 1))));
  };
  run(e);
  el.setPointerCapture?.(e.pointerId);
  const move = (ev: PointerEvent) => run(ev);
  const up = () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerup", up);
  };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerup", up);
}
const onSv = (e: PointerEvent) => drag(e, (x, y) => setHsv({ ...hsv.value, s: x, v: 1 - y }));
const onHue = (e: PointerEvent) => drag(e, (x) => setHsv({ ...hsv.value, h: Math.min(359.9, x * 360) }));

function svKey(e: KeyboardEvent) {
  const d = e.shiftKey ? 0.1 : 0.02;
  const { s, v } = hsv.value;
  const m: Record<string, Partial<Hsv>> = {
    ArrowLeft: { s: Math.max(0, s - d) },
    ArrowRight: { s: Math.min(1, s + d) },
    ArrowUp: { v: Math.min(1, v + d) },
    ArrowDown: { v: Math.max(0, v - d) },
  };
  if (!m[e.key]) return;
  e.preventDefault();
  setHsv({ ...hsv.value, ...m[e.key] });
}
function hueKey(e: KeyboardEvent) {
  const d = e.shiftKey ? 30 : 5;
  const dir = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[e.key];
  if (!dir) return;
  e.preventDefault();
  setHsv({ ...hsv.value, h: (hsv.value.h + dir * d + 360) % 360 });
}
function commitHex() {
  const hex = normalizeHex(hexText.value);
  if (!hex) {
    hexText.value = props.modelValue ?? "";
    return;
  }
  hsv.value = hexToHsv(hex);
  hexText.value = hex;
  emit("update:modelValue", hex);
}
function pickSwatch(v: string) {
  hsv.value = hexToHsv(v);
  hexText.value = v;
  emit("update:modelValue", v);
}
</script>

<template>
  <span data-ar="color-picker" data-part="root" :data-state="[open && 'open', disabled && 'disabled'].filter(Boolean).join(' ') || undefined">
    <button
      ref="chip"
      type="button"
      data-part="chip"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-controls="open ? `${baseId}-panel` : undefined"
      :aria-label="`${label}：${modelValue ?? labels.empty}`"
      :disabled="disabled"
      @click="setOpen(!open)"
    >
      <i data-part="swatch" :style="{ background: modelValue ?? 'transparent' }" :data-empty="modelValue ? undefined : ''" aria-hidden="true" />
      <span data-part="value">{{ modelValue ? modelValue.toUpperCase() : labels.empty }}</span>
    </button>
    <ArFloat :id="`${baseId}-panel`" :open="open" :anchor="chip" ar="color-picker-panel" role="dialog" :label="label" @close="setOpen(false)">
      <template v-if="custom && detail">
        <div
          data-part="sv"
          :style="{ '--ar-color-hue': hueColor }"
          role="slider"
          tabindex="0"
          :aria-label="labels.saturation"
          :aria-valuetext="`${Math.round(hsv.s * 100)}%・${Math.round(hsv.v * 100)}%`"
          @pointerdown.prevent="onSv"
          @keydown="svKey"
        >
          <span data-part="sv-knob" :style="{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }" />
        </div>
        <div
          data-part="hue"
          role="slider"
          tabindex="0"
          :aria-label="labels.hue"
          aria-valuemin="0"
          aria-valuemax="360"
          :aria-valuenow="Math.round(hsv.h)"
          @pointerdown.prevent="onHue"
          @keydown="hueKey"
        >
          <span data-part="hue-knob" :style="{ left: `${(hsv.h / 360) * 100}%` }" />
        </div>
        <label data-part="hex">
          <span data-part="hex-label">{{ labels.hex }}</span>
          <input v-model="hexText" data-part="hex-input" maxlength="7" spellcheck="false" autocomplete="off" @keydown.enter.prevent="commitHex" @blur="commitHex" />
        </label>
      </template>
      <ArColorSwatches data-part="swatches" :model-value="modelValue" :colors="colors" :label="label" @update:model-value="pickSwatch" />
      <button v-if="custom" type="button" data-part="detail" :aria-expanded="detail" @click="detail = !detail">
        <ArIcon :name="detail ? 'minus' : 'plus'" size="sm" />{{ detail ? labels.hide : labels.detail }}
      </button>
    </ArFloat>
  </span>
</template>
