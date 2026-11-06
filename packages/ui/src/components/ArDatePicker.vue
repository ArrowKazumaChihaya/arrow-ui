<script setup lang="ts">
/**
 * ArDatePicker 1.1 — カレンダーから日付を選ぶ。入力欄は ArDateInput と同じ（年はプルダウン、月日は数字）で、
 * 右のカレンダーのボタンでパネルを開く。ARROW では日付は ArDateInput が基本で、カレンダーから選ぶときだけこれを使う。
 * パネル：月の切り替え・土日の色・今日は線・選んだ日は塗り・「今日」「決める」。range なら間は淡いテーマ色。
 */
import { computed, nextTick, ref, watch } from "vue";
import ArFloat from "../internal/ArFloat.vue";
import ArCalendarPanel from "../internal/ArCalendarPanel.vue";
import ArDateInput from "./ArDateInput.vue";
import ArIcon from "./ArIcon.vue";
import { useId } from "../provider/context";
import { dayNumber, inclusiveDays, todayString } from "./date";
import type { ArDatePickerProps } from "./ArDatePicker.contract";
import type { ArDateRangeValue } from "./ArDateRange.contract";

const props = withDefaults(defineProps<ArDatePickerProps>(), {
  range: false,
  min: undefined,
  max: undefined,
  inline: false,
  confirm: true,
  showDays: true,
  invalid: false,
  size: "md",
  disabled: false,
  label: undefined,
  labels: () => ({
    open: "カレンダーから選ぶ",
    prev: "前の月",
    next: "次の月",
    today: "今日",
    ok: "決める",
    separator: "〜",
    title: (y: number, m: number) => `${y}年${m}月`,
    weekdays: ["日", "月", "火", "水", "木", "金", "土"],
    days: (n: number) => `${n}日間`,
  }),
});
const emit = defineEmits<{ "update:modelValue": [value: string | null | ArDateRangeValue]; "update:open": [open: boolean] }>();

const baseId = useId("ar-cal");
const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const panel = ref<InstanceType<typeof ArCalendarPanel> | null>(null);
const open = ref(false);

const rangeValue = computed<ArDateRangeValue>(() =>
  props.range && props.modelValue && typeof props.modelValue === "object" ? props.modelValue : { start: null, end: null },
);
const single = computed(() => (typeof props.modelValue === "string" ? props.modelValue : null));

// 決めるまでの選び途中
const draft = ref<{ start: string | null; end: string | null }>({ start: null, end: null });
const picking = ref(false);
function resetDraft() {
  draft.value = props.range ? { ...rangeValue.value } : { start: single.value, end: null };
  picking.value = false;
}
resetDraft();
watch(() => props.modelValue, resetDraft, { deep: true });

function commit() {
  if (props.range) {
    const { start, end } = draft.value;
    emit("update:modelValue", { start, end: end ?? start });
  } else emit("update:modelValue", draft.value.start);
}

function onPick(d: string) {
  if (!props.range) {
    draft.value = { start: d, end: null };
    if (!props.confirm) finish();
    return;
  }
  if (!picking.value || !draft.value.start) {
    draft.value = { start: d, end: null };
    picking.value = true;
    return;
  }
  const s = draft.value.start;
  draft.value = dayNumber(d) < dayNumber(s) ? { start: d, end: s } : { start: s, end: d };
  picking.value = false;
  if (!props.confirm) finish();
}
function onToday() {
  const t = todayString();
  if (props.range && picking.value) onPick(t);
  else {
    draft.value = { start: t, end: props.range ? t : null };
    picking.value = false;
  }
}
function finish() {
  commit();
  setOpen(false);
}

function setOpen(o: boolean) {
  if (o === open.value) return;
  open.value = o;
  emit("update:open", o);
  if (o) {
    resetDraft();
    nextTick(() => nextTick(() => panel.value?.focusCell()));
  } else if (!props.inline) trigger.value?.focus();
}

const days = computed(() => inclusiveDays(rangeValue.value.start, rangeValue.value.end));
const reversed = computed(
  () => !!rangeValue.value.start && !!rangeValue.value.end && dayNumber(rangeValue.value.end) < dayNumber(rangeValue.value.start),
);
const bad = computed(() => props.invalid || reversed.value);
function setRange(key: "start" | "end", v: string | null) {
  emit("update:modelValue", { ...rangeValue.value, [key]: v });
}
</script>

<template>
  <div
    v-if="inline"
    data-ar="date-picker-panel"
    data-part="root"
    data-inline=""
    :data-range="range || undefined"
    role="group"
    :aria-label="label"
  >
    <ArCalendarPanel
      ref="panel"
      :start="draft.start"
      :end="draft.end"
      :range="range"
      :picking="picking"
      :min="min"
      :max="max"
      :show-footer="confirm"
      :labels="labels"
      :base-id="baseId"
      @pick="onPick"
      @today="onToday"
      @ok="commit"
    />
  </div>
  <div
    v-else
    ref="root"
    data-ar="date-picker"
    data-part="root"
    :data-size="size"
    :data-range="range || undefined"
    :data-state="[bad && 'invalid', disabled && 'disabled', open && 'open'].filter(Boolean).join(' ') || undefined"
    role="group"
    :aria-label="label"
  >
    <div data-part="row">
      <template v-if="range">
        <ArDateInput
          v-bind="inputProps"
          :id="id"
          data-part="start"
          :model-value="rangeValue.start"
          :invalid="bad"
          :disabled="disabled"
          :size="size"
          :label="`${label ?? ''}${labels.start ?? '始まり'}`"
          @update:model-value="(v) => setRange('start', v)"
        />
        <span data-part="separator" aria-hidden="true">{{ labels.separator }}</span>
        <ArDateInput
          v-bind="inputProps"
          data-part="end"
          :model-value="rangeValue.end"
          :invalid="bad"
          :disabled="disabled"
          :size="size"
          :label="`${label ?? ''}${labels.end ?? '終わり'}`"
          @update:model-value="(v) => setRange('end', v)"
        />
      </template>
      <ArDateInput
        v-else
        v-bind="inputProps"
        :id="id"
        data-part="start"
        :model-value="single"
        :invalid="invalid"
        :disabled="disabled"
        :size="size"
        :label="label"
        @update:model-value="(v) => emit('update:modelValue', v)"
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
        <ArIcon line name="cal" size="sm" />
      </button>
      <span v-if="range && showDays && days" data-part="days" aria-live="polite">{{ labels.days(days) }}</span>
    </div>
    <ArFloat
      :id="`${baseId}-panel`"
      :open="open"
      :anchor="root"
      ar="date-picker-panel"
      role="dialog"
      :label="label ? (labels.calendar?.(label) ?? `${label}のカレンダー`) : labels.open"
      @close="setOpen(false)"
    >
      <ArCalendarPanel
        ref="panel"
        :start="draft.start"
        :end="draft.end"
        :range="range"
        :picking="picking"
        :min="min"
        :max="max"
        :show-footer="confirm"
        :labels="labels"
        :base-id="baseId"
        @pick="onPick"
        @today="onToday"
        @ok="finish"
      />
    </ArFloat>
  </div>
</template>
