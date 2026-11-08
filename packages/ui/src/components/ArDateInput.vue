<script setup lang="ts">
/**
 * ArDateInput 1.1 — 日付の入力。年はプルダウン（ブラウザの select は使わない）、月と日は数字（全角も読む）。
 * 曜日は自動で出す（日は赤、土は青）。31日のまま2月にすると末日に寄せる。
 * 年：↓・Enter・Space で開き、↑↓で動かし Enter で決める。数字を打つとその年へ飛ぶ（ArYearInput と同じプルダウン）。
 * 月・日：数字を打って Enter かフォーカスが外れたら確定。↑↓で1ずつ動く。
 */
import { computed, nextTick, ref, watch } from "vue";
import ArYearSelect from "../internal/ArYearSelect.vue";
import { eraLabel } from "../internal/yearParts";
import { useDesignForm } from "../provider/context";
import { clampDate, daysInMonth, formatDate, splitDate, toNumber, weekdayOf } from "./date";
import type { ArDateInputProps } from "./ArDateInput.contract";

const thisYear = new Date().getFullYear();
const props = withDefaults(defineProps<ArDateInputProps>(), {
  minYear: undefined,
  initialYear: undefined,
  years: undefined,
  invalidDate: undefined,
  yearOrder: undefined,
  allowEmptyYear: undefined,
  pad: undefined,
  updateOnInput: false,
  maxYear: undefined,
  era: false,
  showWeekday: true,
  invalid: false,
  size: "md",
  disabled: false,
  label: undefined,
  id: undefined,
  labels: () => ({ year: "年", month: "月", day: "日", weekdays: ["日", "月", "火", "水", "木", "金", "土"] }),
});
const emit = defineEmits<{ "update:modelValue": [value: string | null] }>();

const designinvalidForm = useDesignForm<"clamp" | "message">("ArDateInput", "invalidDate", "clamp");
const designpadForm = useDesignForm<"none" | "zero">("ArDateInput", "pad", "none");
const designyearEmpty = useDesignForm<"none" | "option">("ArDateInput", "yearEmpty", "none");
const designyearOrder = useDesignForm<"asc" | "desc">("ArDateInput", "yearOrder", "asc");
const invalidForm = computed(() => props.invalidDate ?? designinvalidForm.value);
const padForm = computed(() => props.pad ?? designpadForm.value);
const yearEmpty = computed(() => props.allowEmptyYear === undefined ? designyearEmpty.value : props.allowEmptyYear ? "option" : "none");
const yearOrder = computed(() => props.yearOrder ?? designyearOrder.value);
const show = (n: number) => (padForm.value === "zero" ? String(n).padStart(2, "0") : String(n));
let ownUpdate = false;
const initialYear = () => props.initialYear ?? Math.max(props.minYear ?? thisYear - 5, Math.min(thisYear, props.maxYear ?? thisYear + 5));
const parts = ref({ y: "", m: "", d: "" });
/** 打った月日がありえない日（message の形のときだけ）。 */
const badDate = ref(false);
const dayInput = ref<HTMLInputElement | null>(null);
function syncFromValue(v: string | null) {
  const s = splitDate(v);
  if (!s && badDate.value) return; // 「無効な日付」のときは打った数字を残す
  parts.value = s ? { y: String(s.y), m: show(s.m), d: show(s.d) } : { y: parts.value.y || String(initialYear()), m: "", d: "" };
}
syncFromValue(props.modelValue);
watch(() => props.modelValue, value => { if (!ownUpdate) syncFromValue(value); });

const years = computed(() => {
  if (props.years) return [...props.years];
  const cur = Number(parts.value.y) || thisYear;
  const from = Math.min(props.minYear ?? thisYear - 5, cur);
  const to = Math.max(props.maxYear ?? thisYear + 5, cur);
  // desc：新しい年が上（今の ARROW・ArYearInput と同じ）
  return Array.from({ length: to - from + 1 }, (_, i) => (yearOrder.value === "desc" ? to - i : from + i));
});

const weekday = computed(() => {
  const c = splitDate(props.modelValue);
  if (!c) return null;
  const w = weekdayOf(c.y, c.m, c.d);
  return { text: props.labels.weekdays[w] ?? "", kind: w === 0 ? "sun" : w === 6 ? "sat" : "weekday" };
});

function commit(formatParts = true) {
  const y = toNumber(parts.value.y);
  const m = toNumber(parts.value.m);
  const d = toNumber(parts.value.d);
  let next = y && m && d ? clampDate(y, m, d) : null;
  badDate.value = false;
  const malformed = (parts.value.m !== "" && (!m || m > 12)) ||
    (parts.value.d !== "" && (!d || d > 31));
  if (invalidForm.value === "message" && (malformed || (y && m && d && next !== formatDate(y, m, d)))) {
    badDate.value = true;
    next = null;
  }
  if (next !== props.modelValue) {
    ownUpdate = true;
    emit("update:modelValue", next);
    void nextTick(() => { ownUpdate = false; });
  }
  if (formatParts && !badDate.value && next) {
    const s = splitDate(next)!;
    parts.value.m = show(s.m);
    parts.value.d = show(s.d);
  }
}

function inputPart(which: "m" | "d", event: Event) {
  // A live model update must not replace the draft ("1") with a padded value
  // ("01"): the next keystroke still belongs to this field.
  if (props.updateOnInput) commit(false);
  if (which !== "m" || !(event.target instanceof HTMLInputElement)) return;
  const input = event.target;
  const month = toNumber(input.value);
  if (document.activeElement === input && month && month <= 12 &&
      (input.value.length === 2 || month >= 2)) {
    dayInput.value?.focus();
    dayInput.value?.select();
  }
}

function step(which: "m" | "d", e: KeyboardEvent) {
  if (e.key === "Enter") return commit();
  if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
  e.preventDefault();
  const dir = e.key === "ArrowUp" ? 1 : -1;
  const y = toNumber(parts.value.y) ?? thisYear;
  const m = toNumber(parts.value.m);
  const d = toNumber(parts.value.d);
  if (which === "m") {
    const next = m ? ((m - 1 + dir + 12) % 12) + 1 : 1;
    parts.value.m = String(next);
  } else {
    const max = daysInMonth(y, m ?? 1);
    parts.value.d = String(d ? ((d - 1 + dir + max) % max) + 1 : 1);
  }
  if (parts.value.m && parts.value.d) commit();
}

function setYear(y: number | null) {
  if (y === null) {
    parts.value.y = "";
    commit();
    return;
  }
  parts.value.y = String(y);
  commit();
}
</script>

<template>
  <span
    data-ar="date-input"
    data-part="root"
    :data-size="size"
    role="group"
    :aria-label="label"
    :data-era="era || undefined"
    :data-state="[(invalid || badDate) && 'invalid', badDate && 'bad-date', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
  >
    <ArYearSelect
      :id="id"
      :model-value="Number(parts.y) || null"
      :years="years"
      :label-of="era ? eraLabel : undefined"
      :allow-empty="yearEmpty === 'option'"
      :placeholder="labels.empty ?? '未選択'"
      :invalid="invalid"
      :disabled="disabled"
      :label="`${label ?? ''}${labels.year}`"
      @update:model-value="setYear"
    />
    <span data-part="unit" aria-hidden="true">{{ labels.year }}</span>
    <input
      v-model="parts.m"
      data-part="month"
      inputmode="numeric"
      autocomplete="off"
      maxlength="2"
      :disabled="disabled"
      :aria-label="`${label ?? ''}${labels.month}`"
      :aria-invalid="invalid || badDate || undefined"
      @input="inputPart('m', $event)"
      @blur="commit()"
      @keydown="step('m', $event)"
    />
    <span data-part="unit" aria-hidden="true">{{ labels.month }}</span>
    <input
      ref="dayInput"
      v-model="parts.d"
      data-part="day"
      inputmode="numeric"
      autocomplete="off"
      maxlength="2"
      :disabled="disabled"
      :aria-label="`${label ?? ''}${labels.day}`"
      :aria-invalid="invalid || badDate || undefined"
      @input="inputPart('d', $event)"
      @blur="commit()"
      @keydown="step('d', $event)"
    />
    <span data-part="unit" aria-hidden="true">{{ labels.day }}</span>
    <span v-if="badDate" data-part="error" role="alert">{{ labels.invalidDate ?? "無効な日付" }}</span>
    <span v-else-if="showWeekday" data-part="weekday" :data-kind="weekday?.kind">{{ weekday ? `（${weekday.text}）` : "" }}</span>
  </span>
</template>
