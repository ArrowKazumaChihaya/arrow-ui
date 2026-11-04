<script setup lang="ts">
/**
 * ArTimeInput 1.1 — 時刻の入力。ARROW の時刻はこれを使う（パネルで選ぶ ArTimePicker は補助）。
 * - 形はデザインが選ぶ（fields）：1つの箱に「09:30」と打つ（single）／時と分が別々の箱を「:」でつなぐ（split＝今の ARROW）。
 * - キー入力が基本：single は「930」「9:30」「０９３０」が 09:30。↑↓で step 分ずつ動く。
 * - dayShift なら［当日⇄前日］の切り替え（形はデザインが選ぶ：枠と一体のボタン／1文字のリンク「当」「前」）。Tab では止まらない。
 * - select なら時と分のプルダウン（今の ARROW の isSelect。先頭に「未選択」）。
 * - 値の確定は Enter・箱からフォーカスが外れたとき・切り替え・プルダウンで選んだときだけ。
 * - note を渡すと入力の代わりに点線の枠で文字を出す（「打刻と同じ」など）。
 */
import { computed, nextTick, ref, watch } from "vue";
import { parseTime, toMinutes } from "./time";
import ArSelect from "./ArSelect.vue";
import { useDesignForm } from "../provider/context";
import type { ArTimeInputLabels, ArTimeInputProps, ArTimeValue } from "./ArTimeInput.contract";
import type { ArSelectValue } from "./ArSelect.contract";

const props = withDefaults(defineProps<ArTimeInputProps>(), {
  dayShift: false,
  overnight: false,
  step: 5,
  select: false,
  minuteStep: 1,
  size: "md",
  block: false,
  note: undefined,
  invalid: false,
  disabled: false,
  placeholder: "--:--",
  label: undefined,
  id: undefined,
  labels: () => ({ same: "当日", prev: "前日", sameShort: "当", prevShort: "前", toggleHint: "押すと当日と前日が切り替わります", hour: "時", minute: "分" }),
});
const emit = defineEmits<{
  "update:modelValue": [value: ArTimeValue];
  commit: [value: ArTimeValue];
  invalid: [text: string];
}>();

const fields = useDesignForm<"single" | "split">("ArTimeInput", "fields", "single");
const dayToggle = useDesignForm<"button" | "link">("ArTimeInput", "dayToggle", "button");
/** split の箱で打つか（note・select のときは箱を出さない）。 */
const split = computed(() => !props.select && fields.value === "split");
const L = computed<Required<ArTimeInputLabels>>(() => ({
  hour: "時",
  minute: "分",
  sameShort: [...props.labels.same][0] ?? "",
  prevShort: [...props.labels.prev][0] ?? "",
  ...(props.labels as Partial<ArTimeInputLabels>),
} as Required<ArTimeInputLabels>));

const root = ref<HTMLElement | null>(null);
const hourEl = ref<HTMLInputElement | null>(null);
const minuteEl = ref<HTMLInputElement | null>(null);

/* ---------- single：1つの箱 ---------- */
const text = ref(props.modelValue.time ?? "");
const unreadable = ref(false);
const focused = ref(false);

/* ---------- split・select：時と分 ---------- */
/** "HH:mm" を時と分の文字に分ける。split では時が 00 なら空で見せる（今の ARROW と同じ）。 */
function partsOf(time: string | null, blankZeroHour: boolean): [string, string] {
  const m = time ? /^(\d{1,2}):(\d{2})$/.exec(time) : null;
  if (!m) return ["", ""];
  const h = m[1]!.padStart(2, "0");
  return [blankZeroHour && h === "00" ? "" : h, m[2]!];
}
const [h0, m0] = partsOf(props.modelValue.time, !props.select);
const hourText = ref(h0);
const minuteText = ref(m0);

watch(
  () => props.modelValue.time,
  (t) => {
    if (!focused.value) {
      text.value = t ?? "";
      unreadable.value = false;
      // 片方だけ選んだプルダウンは、値が null のままなら残す
      if (props.select && t === null && (hourText.value === "" || minuteText.value === "")) return;
      const [h, m] = partsOf(t, !props.select);
      hourText.value = h;
      minuteText.value = m;
    }
  },
);

const maxHour = computed(() => (props.overnight ? 47 : 23));
const day = computed(() => (props.dayShift ? props.modelValue.day : "same"));
const empty = computed(() => (split.value || props.select ? !hourText.value && !minuteText.value : !text.value));
const state = computed(
  () =>
    [
      day.value === "prev" && "prev",
      (props.invalid || unreadable.value) && "invalid",
      props.disabled && "disabled",
      props.note && "note",
      empty.value && "empty",
    ]
      .filter(Boolean)
      .join(" ") || undefined,
);

function send(value: ArTimeValue) {
  emit("update:modelValue", value);
  emit("commit", value);
}

/** 時と分の文字から "HH:mm"。分が空なら null（時だけ空なら 0 時）。読めなければ undefined。 */
function joinParts(h: string, m: string, hourRequired: boolean): string | null | undefined {
  if (m === "" || (hourRequired && h === "")) return null;
  const hh = h === "" ? 0 : Number(h);
  const mm = Number(m);
  if (!Number.isInteger(hh) || !Number.isInteger(mm) || hh < 0 || mm < 0 || hh > maxHour.value || mm > 59) return undefined;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function commit() {
  const parsed = split.value || props.select ? joinParts(hourText.value, minuteText.value, props.select) : parseTime(text.value, maxHour.value);
  if (parsed === undefined) {
    unreadable.value = true;
    emit("invalid", split.value ? `${hourText.value}:${minuteText.value}` : text.value);
    return;
  }
  unreadable.value = false;
  if (!split.value && !props.select) text.value = parsed ?? "";
  if (parsed !== props.modelValue.time) send({ time: parsed, day: day.value });
}

function toggleDay() {
  if (props.disabled) return;
  const parsed =
    split.value || props.select ? joinParts(hourText.value, minuteText.value, props.select) : parseTime(text.value, maxHour.value);
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

/* ---------- split の動き（今の ARROW の Time.vue と同じ） ---------- */
const digits = (s: string) => s.normalize("NFKC").replace(/\D/g, "");
function focusBox(el: HTMLInputElement | null | undefined) {
  if (!el) return;
  el.focus();
  el.select();
}
/** ページの中の次（前）の時刻の箱へ。 */
function focusNeighbor(from: HTMLInputElement, dir: 1 | -1) {
  const all = [...document.querySelectorAll<HTMLInputElement>('[data-ar="time-input"]>input:is([data-part="hour"],[data-part="minute"])')].filter(
    (x) => !x.disabled,
  );
  focusBox(all[all.indexOf(from) + dir]);
}
function onHourInput(e: Event) {
  const el = e.target as HTMLInputElement;
  let v = digits(el.value);
  let advance = false;
  if (v.length >= 2) {
    v = v.slice(0, 2);
    if (Number(v) > maxHour.value) v = v.slice(0, 1);
    else advance = true;
  } else if (v.length === 1 && Number(v) * 10 > maxHour.value) {
    v = `0${v}`;
    advance = true;
  }
  el.value = v;
  hourText.value = v;
  unreadable.value = false;
  if (advance) nextTick(() => focusBox(minuteEl.value));
}
function onMinuteInput(e: Event) {
  const el = e.target as HTMLInputElement;
  let v = digits(el.value);
  let advance = false;
  if (v.length >= 2) {
    v = v.slice(0, 2);
    if (Number(v) > 59) v = v.slice(0, 1);
    else advance = true;
  } else if (v.length === 1 && Number(v) >= 6) {
    v = `0${v}`;
    advance = true;
  }
  el.value = v;
  minuteText.value = v;
  unreadable.value = false;
  if (advance) {
    commit();
    nextTick(() => focusNeighbor(el, 1));
  }
}
function onSplitKeydown(e: KeyboardEvent, which: "hour" | "minute") {
  const el = e.target as HTMLInputElement;
  const atStart = el.selectionStart === 0 && el.selectionEnd === 0;
  const atEnd = el.selectionStart === el.value.length && el.selectionEnd === el.value.length;
  if (e.key === "Enter") {
    commit();
  } else if (e.key === "Backspace" && el.value === "") {
    e.preventDefault();
    if (which === "minute") focusBox(hourEl.value);
    else focusNeighbor(el, -1);
  } else if (e.key === "ArrowLeft" && atStart) {
    e.preventDefault();
    if (which === "minute") focusBox(hourEl.value);
    else focusNeighbor(el, -1);
  } else if (e.key === "ArrowRight" && atEnd) {
    e.preventDefault();
    if (which === "hour") focusBox(minuteEl.value);
    else focusNeighbor(el, 1);
  } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    const base = joinParts(hourText.value, minuteText.value || "00", false) ?? props.modelValue.time ?? "09:00";
    const [h, m] = partsOf(shift(base, e.key === "ArrowUp" ? props.step : -props.step), false);
    hourText.value = h;
    minuteText.value = m;
    unreadable.value = false;
  }
}
function onSplitFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as Node | null;
  if (next && root.value?.contains(next)) return;
  focused.value = false;
  commit();
}

/* ---------- select：時と分のプルダウン ---------- */
const pad2 = (n: number) => String(n).padStart(2, "0");
const hourOptions = computed(() => Array.from({ length: maxHour.value + 1 }, (_, i) => ({ value: pad2(i), label: pad2(i) })));
const minuteOptions = computed(() => {
  const out: { value: string; label: string }[] = [];
  const s = Math.max(1, Math.floor(props.minuteStep));
  for (let i = 0; i < 60; i += s) out.push({ value: pad2(i), label: pad2(i) });
  return out;
});
function pick(which: "hour" | "minute", v: ArSelectValue | null | readonly ArSelectValue[]) {
  const s = v == null || Array.isArray(v) ? "" : String(v);
  if (which === "hour") hourText.value = s;
  else minuteText.value = s;
  const time = joinParts(hourText.value, minuteText.value, true) ?? null;
  if (time !== props.modelValue.time) send({ time, day: day.value });
}

const dayText = computed(() =>
  dayToggle.value === "link"
    ? day.value === "prev"
      ? L.value.prevShort
      : L.value.sameShort
    : day.value === "prev"
      ? props.labels.prev
      : props.labels.same,
);
const fieldName = (part: string) => (props.label ? `${props.label}の${part}` : part);
</script>

<template>
  <span
    ref="root"
    data-ar="time-input"
    data-part="root"
    :data-size="size"
    :data-block="block || undefined"
    :data-state="state"
    :data-fields="select ? 'select' : split ? 'split' : 'single'"
    :data-day-shift="(dayShift && !note) || undefined"
    :data-day-toggle="dayShift && !note ? dayToggle : undefined"
    :role="split || select ? 'group' : undefined"
    :aria-label="split || select ? label : undefined"
    @focusout="split ? onSplitFocusOut($event) : undefined"
  >
    <button
      v-if="dayShift && !note"
      type="button"
      data-part="day-toggle"
      :data-kind="dayToggle"
      tabindex="-1"
      :aria-pressed="day === 'prev'"
      :aria-label="`${label ?? ''}${day === 'prev' ? labels.prev : labels.same}（${labels.toggleHint}）`"
      :title="labels.toggleHint"
      :disabled="disabled"
      @click="toggleDay"
    >
      {{ dayText }}
    </button>
    <span v-if="note" :id="id" data-part="note" role="note" :aria-label="label ? `${label}：${note}` : note">{{ note }}</span>
    <template v-else-if="select">
      <ArSelect
        :id="id"
        data-field="hour"
        :model-value="hourText || null"
        :options="hourOptions"
        null-option="未選択"
        :searchable="false"
        placeholder=""
        :size="size"
        :disabled="disabled"
        :invalid="invalid"
        :label="fieldName(L.hour)"
        @update:model-value="(v) => pick('hour', v)"
      />
      <span data-part="separator" aria-hidden="true"><slot name="hour-unit">:</slot></span>
      <ArSelect
        data-field="minute"
        :model-value="minuteText || null"
        :options="minuteOptions"
        null-option="未選択"
        :searchable="false"
        placeholder=""
        :size="size"
        :disabled="disabled"
        :invalid="invalid"
        :label="fieldName(L.minute)"
        @update:model-value="(v) => pick('minute', v)"
      />
      <span v-if="$slots['minute-unit']" data-part="unit" aria-hidden="true"><slot name="minute-unit" /></span>
    </template>
    <template v-else-if="split">
      <input
        :id="id"
        ref="hourEl"
        data-part="hour"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        maxlength="2"
        :value="hourText"
        :disabled="disabled"
        :aria-label="fieldName(L.hour)"
        :aria-invalid="invalid || unreadable ? 'true' : undefined"
        @focus="focused = true"
        @input="onHourInput"
        @keydown="onSplitKeydown($event, 'hour')"
      /><span data-part="separator" aria-hidden="true">:</span
      ><input
        ref="minuteEl"
        data-part="minute"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        maxlength="2"
        :value="minuteText"
        :disabled="disabled"
        :aria-label="fieldName(L.minute)"
        :aria-invalid="invalid || unreadable ? 'true' : undefined"
        @focus="focused = true"
        @input="onMinuteInput"
        @keydown="onSplitKeydown($event, 'minute')"
      />
    </template>
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
