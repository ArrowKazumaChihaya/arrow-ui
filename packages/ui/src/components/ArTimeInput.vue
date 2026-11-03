<script setup lang="ts">
/**
 * ArTimeInput 1.0 — 時刻の入力（高さ36・角丸9）。ARROW の時刻はこれを使う（パネルで選ぶ ArTimePicker は補助）。
 * - キー入力が基本：「930」「9:30」「０９３０」は 09:30 になる。↑↓で step 分ずつ動く。
 * - dayShift なら枠と一体の［当日］ボタン。押すたびに［前日］（橙）と切り替わる。Tab では止まらない。
 * - 値の確定は Enter・フォーカスが外れたとき・切り替えのときだけ。
 * - note を渡すと入力の代わりに点線の枠で文字を出す（「打刻と同じ」など）。
 */
import { computed, ref, watch } from "vue";
import { parseTime, toMinutes } from "./time";
import type { ArTimeInputProps, ArTimeValue } from "./ArTimeInput.contract";

const props = withDefaults(defineProps<ArTimeInputProps>(), {
  dayShift: false,
  overnight: false,
  step: 5,
  size: "md",
  block: false,
  note: undefined,
  invalid: false,
  disabled: false,
  placeholder: "--:--",
  label: undefined,
  id: undefined,
  labels: () => ({ same: "当日", prev: "前日", toggleHint: "押すと当日と前日が切り替わります" }),
});
const emit = defineEmits<{
  "update:modelValue": [value: ArTimeValue];
  commit: [value: ArTimeValue];
  invalid: [text: string];
}>();

const text = ref(props.modelValue.time ?? "");
const unreadable = ref(false);
const focused = ref(false);
watch(
  () => props.modelValue.time,
  (t) => {
    if (!focused.value) {
      text.value = t ?? "";
      unreadable.value = false;
    }
  },
);

const maxHour = computed(() => (props.overnight ? 47 : 23));
const day = computed(() => (props.dayShift ? props.modelValue.day : "same"));
const state = computed(
  () =>
    [
      day.value === "prev" && "prev",
      (props.invalid || unreadable.value) && "invalid",
      props.disabled && "disabled",
      props.note && "note",
      !text.value && "empty",
    ]
      .filter(Boolean)
      .join(" ") || undefined,
);

function send(value: ArTimeValue) {
  emit("update:modelValue", value);
  emit("commit", value);
}

function commit() {
  const parsed = parseTime(text.value, maxHour.value);
  if (parsed === undefined) {
    unreadable.value = true;
    emit("invalid", text.value);
    return;
  }
  unreadable.value = false;
  text.value = parsed ?? "";
  if (parsed !== props.modelValue.time) send({ time: parsed, day: day.value });
}

function toggleDay() {
  if (props.disabled) return;
  const parsed = parseTime(text.value, maxHour.value);
  const time = parsed === undefined ? props.modelValue.time : parsed;
  send({ time, day: day.value === "prev" ? "same" : "prev" });
}

function shift(base: string, minutes: number): string {
  const span = (maxHour.value + 1) * 60;
  const t = ((((toMinutes(base) ?? 0) + minutes) % span) + span) % span;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    commit();
    return;
  }
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    const base = parseTime(text.value, maxHour.value) ?? props.modelValue.time ?? "09:00";
    text.value = shift(base, e.key === "ArrowUp" ? props.step : -props.step);
    unreadable.value = false;
  }
}

function onBlur() {
  focused.value = false;
  commit();
}
</script>

<template>
  <span data-ar="time-input" data-part="root" :data-size="size" :data-block="block || undefined" :data-state="state">
    <button
      v-if="dayShift && !note"
      type="button"
      data-part="day-toggle"
      tabindex="-1"
      :aria-pressed="day === 'prev'"
      :aria-label="`${label ?? ''}${day === 'prev' ? labels.prev : labels.same}（${labels.toggleHint}）`"
      :title="labels.toggleHint"
      :disabled="disabled"
      @click="toggleDay"
    >
      {{ day === "prev" ? labels.prev : labels.same }}
    </button>
    <span v-if="note" :id="id" data-part="note" role="note" :aria-label="label ? `${label}：${note}` : note">{{ note }}</span>
    <input
      v-else
      :id="id"
      v-model="text"
      data-part="input"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      maxlength="5"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-label="id ? undefined : label"
      :aria-invalid="invalid || unreadable ? 'true' : undefined"
      @focus="focused = true"
      @blur="onBlur"
      @keydown="onKeydown"
    />
  </span>
</template>
