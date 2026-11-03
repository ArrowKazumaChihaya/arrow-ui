<script setup lang="ts">
/**
 * ArTimePicker 1.0 — 時・分の列から時刻を選ぶパネル。
 * ARROW の時刻はキー入力が基本なので、ふだんは ArTimeInput（前日の切り替えつき）を使う。これは「選ぶ方が早い」画面の補助。
 * 入力欄は ArTimeInput と同じで、右の時計のボタンでパネルを開く。分の刻みは設定に合わせる（minuteStep）。
 * パネルのキーボード：↑↓で動かす、←→で時と分を行き来、Enter で決める、Escape で閉じる。
 */
import { computed, nextTick, onMounted, ref, watch } from "vue";
import ArFloat from "../internal/ArFloat.vue";
import ArTimePanel from "../internal/ArTimePanel.vue";
import ArIcon from "./ArIcon.vue";
import ArTimeInput from "./ArTimeInput.vue";
import { useId } from "../provider/context";
import { toMinutes } from "./time";
import type { ArTimePickerProps } from "./ArTimePicker.contract";

const props = withDefaults(defineProps<ArTimePickerProps>(), {
  minuteStep: 10,
  hours: () => [0, 23] as const,
  inline: false,
  confirm: true,
  size: "md",
  invalid: false,
  disabled: false,
  label: undefined,
  labels: () => ({ open: "時刻を選ぶ", hour: "時", minute: "分", now: "今", ok: "決める" }),
});
const emit = defineEmits<{ "update:modelValue": [value: string | null]; "update:open": [open: boolean] }>();

const baseId = useId("ar-tp");
const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const panel = ref<InstanceType<typeof ArTimePanel> | null>(null);
const open = ref(false);

const pad = (n: number) => String(n).padStart(2, "0");
const hourList = computed(() => Array.from({ length: props.hours[1] - props.hours[0] + 1 }, (_, i) => props.hours[0] + i));
const minuteList = computed(() => Array.from({ length: Math.ceil(60 / props.minuteStep) }, (_, i) => i * props.minuteStep));

const draft = ref({ h: 9, m: 0 });
function reset() {
  const t = toMinutes(props.modelValue);
  draft.value = t === null ? { h: 9, m: 0 } : { h: Math.floor(t / 60), m: t % 60 };
}
reset();
watch(() => props.modelValue, reset);

function ok() {
  emit("update:modelValue", `${pad(draft.value.h)}:${pad(draft.value.m)}`);
  setOpen(false);
}
function now() {
  const d = new Date();
  draft.value = { h: d.getHours(), m: Math.floor(d.getMinutes() / props.minuteStep) * props.minuteStep };
  nextTick(() => panel.value?.scrollOn());
}
function setM(m: number) {
  draft.value = { ...draft.value, m };
  if (!props.confirm) ok();
}
function setOpen(o: boolean) {
  if (o === open.value) return;
  open.value = o;
  emit("update:open", o);
  if (o) {
    reset();
    nextTick(() => requestAnimationFrame(() => panel.value?.focusFirst()));
  } else if (!props.inline) trigger.value?.focus();
}
onMounted(() => props.inline && panel.value?.scrollOn());
</script>

<template>
  <div v-if="inline" data-ar="time-picker-panel" data-part="root" data-inline="" role="group" :aria-label="label">
    <ArTimePanel
      ref="panel"
      :h="draft.h"
      :m="draft.m"
      :hours="hourList"
      :minutes="minuteList"
      :show-footer="confirm"
      :base-id="baseId"
      :labels="labels"
      @update:h="(h) => (draft = { ...draft, h })"
      @update:m="setM"
      @now="now"
      @ok="emit('update:modelValue', `${pad(draft.h)}:${pad(draft.m)}`)"
    />
  </div>
  <span
    v-else
    ref="root"
    data-ar="time-picker"
    data-part="root"
    :data-size="size"
    :data-state="[invalid && 'invalid', disabled && 'disabled', open && 'open'].filter(Boolean).join(' ') || undefined"
  >
    <ArTimeInput
      data-part="input"
      :model-value="{ time: modelValue, day: 'same' }"
      :step="minuteStep"
      :size="size"
      :overnight="hours[1] > 23"
      :invalid="invalid"
      :disabled="disabled"
      :label="label"
      @update:model-value="(v) => emit('update:modelValue', v.time)"
    />
    <button
      ref="trigger"
      type="button"
      data-part="trigger"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-controls="open ? `${baseId}-panel` : undefined"
      :aria-label="`${label ?? ''}${labels.open}`"
      :title="labels.open"
      :disabled="disabled"
      @click="setOpen(!open)"
    >
      <ArIcon line name="clock" size="sm" />
    </button>
    <ArFloat
      :id="`${baseId}-panel`"
      :open="open"
      :anchor="root"
      ar="time-picker-panel"
      role="dialog"
      :label="label ? `${label}を選ぶ` : labels.open"
      @close="setOpen(false)"
    >
      <ArTimePanel
        ref="panel"
        :h="draft.h"
        :m="draft.m"
        :hours="hourList"
        :minutes="minuteList"
        :show-footer="confirm"
        :base-id="baseId"
        :labels="labels"
        @update:h="(h) => (draft = { ...draft, h })"
        @update:m="setM"
        @now="now"
        @ok="ok"
      />
    </ArFloat>
  </span>
</template>
