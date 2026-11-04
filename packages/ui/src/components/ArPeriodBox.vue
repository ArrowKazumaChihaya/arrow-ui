<script setup lang="ts">
/**
 * ArPeriodBox 1.0 — 期間の箱。1か月／半月／カスタムの切り替えと期間、中に決まり（スロット）、下に「適用」。
 * 期間は "YYYY-MM-DD" の start・end で受け渡し、1か月・半月を選ぶと月の初め〜末日、1〜15日／16日〜末日にそろえる。
 * 日付を直して1か月・半月に合わなくなったら「カスタム」に変える。形（range／nav）はデザインが選ぶ。
 */
import { computed } from "vue";
import ArButton from "./ArButton.vue";
import ArDateRange from "./ArDateRange.vue";
import ArIcon from "./ArIcon.vue";
import ArPeriodNav from "./ArPeriodNav.vue";
import ArRadioGroup from "./ArRadioGroup.vue";
import ArSegmented from "./ArSegmented.vue";
import { useDesignForm } from "../provider/context";
import type { ArPeriodBoxLabels, ArPeriodBoxProps, ArPeriodBoxValue, ArPeriodMode } from "./ArPeriodBox.contract";
import type { ArDateRangeValue } from "./ArDateRange.contract";

const props = withDefaults(defineProps<ArPeriodBoxProps>(), {
  modes: () => ["month", "half", "custom"],
  applyText: undefined,
  applyDisabled: false,
  hint: undefined,
  minYear: undefined,
  maxYear: undefined,
  disabled: false,
  labels: () => ({}),
});
const emit = defineEmits<{ "update:modelValue": [value: ArPeriodBoxValue]; apply: [value: ArPeriodBoxValue] }>();

/** 形（ArDesign.forms.ArPeriodBox.layout）。 */
const layout = useDesignForm<"range" | "nav">("ArPeriodBox", "layout", "range");
const L = computed<ArPeriodBoxLabels>(() => ({
  month: layout.value === "nav" ? "月" : "1か月",
  half: "半月",
  custom: "カスタム",
  first: layout.value === "nav" ? "(前半)" : "前半",
  second: layout.value === "nav" ? "(後半)" : "後半",
  prevMonth: "前の月",
  nextMonth: "次の月",
  modes: "期間の決め方",
  halves: "前半・後半",
  ...props.labels,
}));

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
const lastDay = (y: number, m: number) => new Date(y, m, 0).getDate();
const parts = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return { y: y || new Date().getFullYear(), m: m || 1, d: d || 1 };
};
const start = computed(() => parts(props.modelValue.start));
/** 1か月・半月の範囲。 */
function rangeOf(mode: ArPeriodMode, y: number, m: number, second: boolean): ArPeriodBoxValue {
  if (mode === "half") return second ? { mode, start: ymd(y, m, 16), end: ymd(y, m, lastDay(y, m)) } : { mode, start: ymd(y, m, 1), end: ymd(y, m, 15) };
  return { mode: "month", start: ymd(y, m, 1), end: ymd(y, m, lastDay(y, m)) };
}
const isSecond = computed(() => start.value.d >= 16);
function set(v: ArPeriodBoxValue) {
  emit("update:modelValue", v);
}
const shown = computed(() => (layout.value === "nav" ? props.modes.filter((m) => m !== "custom") : props.modes));
const modeOptions = computed(() => shown.value.map((m) => ({ value: m, label: L.value[m] })));
function pickMode(mode: unknown) {
  const k = mode as ArPeriodMode;
  if (k === props.modelValue.mode) return;
  if (k === "custom") return set({ ...props.modelValue, mode: "custom" });
  set(rangeOf(k, start.value.y, start.value.m, isSecond.value));
}
function pickHalf(v: unknown) {
  set(rangeOf("half", start.value.y, start.value.m, v === "second"));
}
function shiftMonth(step: number) {
  const t = new Date(start.value.y, start.value.m - 1 + step, 1);
  const y = t.getFullYear();
  const m = t.getMonth() + 1;
  set(props.modelValue.mode === "custom" ? rangeOf("month", y, m, false) : rangeOf(props.modelValue.mode, y, m, isSecond.value));
}
/** 日付を直したら、1か月・半月に合うかを見て決め方を変える。 */
function onRange(r: ArDateRangeValue) {
  if (!r.start || !r.end) return set({ ...props.modelValue, start: r.start ?? "", end: r.end ?? "", mode: "custom" });
  const s = parts(r.start);
  const same = (v: ArPeriodBoxValue) => v.start === r.start && v.end === r.end;
  const month = rangeOf("month", s.y, s.m, false);
  const half = rangeOf("half", s.y, s.m, s.d >= 16);
  const mode: ArPeriodMode = same(month) && props.modes.includes("month") ? "month" : same(half) && props.modes.includes("half") ? "half" : "custom";
  set({ mode, start: r.start, end: r.end });
}
const monthLabel = computed(() => `${start.value.y}年${start.value.m}月`);
</script>

<template>
  <div data-ar="period-box" data-part="root" :data-layout="layout" :data-disabled="disabled || undefined" role="group" :aria-label="label">
    <div data-part="box">
      <template v-if="layout === 'nav'">
        <ArPeriodNav
          data-part="nav"
          :label="monthLabel"
          :labels="{ prev: L.prevMonth, next: L.nextMonth, pick: label }"
          :prev-disabled="disabled"
          :next-disabled="disabled"
          @prev="shiftMonth(-1)"
          @next="shiftMonth(1)"
        />
        <div v-if="modeOptions.length > 1" data-part="modes">
          <ArRadioGroup type="button" :model-value="modelValue.mode" :options="modeOptions" :label="L.modes" :disabled="disabled" @update:model-value="pickMode" />
          <ArRadioGroup
            v-if="modelValue.mode === 'half'"
            type="button"
            :model-value="isSecond ? 'second' : 'first'"
            :options="[
              { value: 'first', label: L.first },
              { value: 'second', label: L.second },
            ]"
            :label="L.halves"
            :disabled="disabled"
            @update:model-value="pickHalf"
          />
        </div>
      </template>
      <template v-else>
        <div data-part="modes">
          <ArSegmented v-if="modeOptions.length > 1" :model-value="modelValue.mode" :options="modeOptions" :label="L.modes" size="sm" :disabled="disabled" @update:model-value="pickMode" />
          <span v-if="hint" data-part="hint">{{ hint }}</span>
        </div>
        <ArDateRange
          data-part="range"
          :model-value="{ start: modelValue.start || null, end: modelValue.end || null }"
          show-days
          validate
          :min-year="minYear"
          :max-year="maxYear"
          :disabled="disabled"
          :label="label"
          @update:model-value="onRange"
        />
      </template>
      <div v-if="$slots.default" data-part="body"><slot /></div>
      <div v-if="layout === 'nav' && $slots.actions" data-part="actions"><slot name="actions" /></div>
    </div>
    <div v-if="applyText || (layout !== 'nav' && $slots.actions)" data-part="apply">
      <slot v-if="layout !== 'nav'" name="actions" />
      <ArButton
        v-if="applyText"
        tone="primary"
        :size="layout === 'nav' ? 'xl' : 'md'"
        :icon="layout === 'nav' ? undefined : 'cal'"
        :disabled="applyDisabled || disabled"
        @click="emit('apply', modelValue)"
        >{{ applyText }}</ArButton
      >
      <ArIcon v-if="applyText && layout === 'nav'" name="apply" data-part="apply-arrow" />
    </div>
  </div>
</template>
