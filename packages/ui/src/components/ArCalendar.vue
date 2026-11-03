<script setup lang="ts">
/**
 * ArCalendar 1.0 — 月の表示のカレンダー（見出しは淡いテーマ色、今日はテーマ色の丸、選んだ日はテーマ色の枠）。
 * マスの中身は cell slot（イベント・不足など）。年の表示（12か月）にも切り替えられる。
 * size="mini" は小さなカレンダー（設定のシフトテンプレートの「カレンダーで確かめる」）：見出しは絵と題だけ、マスに札と小さな文字、下に footer slot。
 * キーボード：←→↑↓ で日を移り、PageUp / PageDown で月（Shift で年）、Home / End で週の端、Enter / Space で選ぶ。
 */
import { computed, nextTick, ref, watch } from "vue";
import ArSelect from "./ArSelect.vue";
import ArIcon from "./ArIcon.vue";
import { daysInMonth, formatDate, splitDate, weekdayOf } from "./date";
import { useDesignForm, useId } from "../provider/context";
import type { ArCalendarCell, ArCalendarEvent, ArCalendarProps } from "./ArCalendar.contract";

const props = withDefaults(defineProps<ArCalendarProps>(), {
  variant: "sheet",
  size: "default",
  title: undefined,
  cellMarks: undefined,
  modelValue: null,
  range: undefined,
  month: undefined,
  mode: undefined,
  today: undefined,
  weekStart: 0,
  weekendColors: false,
  showHeader: true,
  minYear: undefined,
  maxYear: undefined,
  disabledDate: undefined,
  showAdjacent: true,
  events: () => [],
  label: undefined,
  labels: () => ({
    weekdays: ["日", "月", "火", "水", "木", "金", "土"],
    month: "月",
    year: "年",
    yearSelect: "年",
    modeSwitch: "表示の切り替え",
    locked: "ロック中",
    unpublished: "非公開",
    alert: "注意",
  }),
});
const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:month": [value: string];
  "update:mode": [value: "month" | "year"];
  select: [value: string];
}>();
defineSlots<{
  cell?: (p: ArCalendarCell) => unknown;
  "month-cell"?: (p: { year: number; month: number; current: boolean; selected: boolean }) => unknown;
  extra?: () => unknown;
  footer?: () => unknown;
}>();

const id = useId("ar-calendar");
const localToday = () => {
  const d = new Date();
  return formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
};
const todayStr = computed(() => props.today ?? localToday());

/* 表示している月（親が持たなければ中で持つ） */
const start = splitDate(props.modelValue) ?? splitDate(todayStr.value)!;
const innerMonth = ref(`${start.y}-${String(start.m).padStart(2, "0")}`);
const ym = computed(() => {
  const s = props.month ?? innerMonth.value;
  const m = /^(\d{4})-(\d{2})$/.exec(s);
  return m ? { y: Number(m[1]), m: Number(m[2]) } : { y: start.y, m: start.m };
});
function setMonth(y: number, m: number) {
  const v = `${y}-${String(m).padStart(2, "0")}`;
  innerMonth.value = v;
  emit("update:month", v);
}
const innerMode = ref<"month" | "year">("month");
const mode = computed(() => props.mode ?? innerMode.value);
function setMode(v: "month" | "year") {
  innerMode.value = v;
  emit("update:mode", v);
}

/* 年の選択 */
const years = computed(() => {
  const t = splitDate(todayStr.value)!.y;
  const lo = Math.min(props.minYear ?? t - 5, ym.value.y);
  const hi = Math.max(props.maxYear ?? t + 5, ym.value.y);
  return Array.from({ length: hi - lo + 1 }, (_, i) => ({ value: lo + i, label: `${lo + i}${props.labels.year}` }));
});
function onYear(v: string | number | readonly (string | number)[] | null) {
  if (v !== null && !Array.isArray(v)) setMonth(Number(v), ym.value.m);
}

/* 日のマス（6週ぶん。最後の週がまるごと次の月なら落とす） */
function shift(date: string, days: number): string {
  const p = splitDate(date)!;
  const d = new Date(Date.UTC(p.y, p.m - 1, p.d + days));
  return formatDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}
function addMonths(date: string, n: number): string {
  const p = splitDate(date)!;
  const t = p.y * 12 + (p.m - 1) + n;
  const y = Math.floor(t / 12);
  const m = (t % 12) + 1;
  return formatDate(y, m, Math.min(p.d, daysInMonth(y, m)));
}
const weekdays = computed(() => Array.from({ length: 7 }, (_, i) => (i + props.weekStart) % 7));
const weeks = computed<ArCalendarCell[][]>(() => {
  const { y, m } = ym.value;
  const r = props.range && splitDate(props.range.start) && splitDate(props.range.end) ? props.range : undefined;
  let first: string;
  let total: number;
  if (r) {
    const s = splitDate(r.start)!;
    const e = splitDate(r.end)!;
    const lead = (weekdayOf(s.y, s.m, s.d) - props.weekStart + 7) % 7;
    first = shift(r.start, -lead);
    const days = Math.round((Date.UTC(e.y, e.m - 1, e.d) - Date.UTC(s.y, s.m - 1, s.d)) / 86400000) + 1;
    total = Math.ceil((lead + Math.max(days, 1)) / 7) * 7;
  } else {
    const lead = (weekdayOf(y, m, 1) - props.weekStart + 7) % 7;
    first = shift(formatDate(y, m, 1), -lead);
    total = Math.ceil((lead + daysInMonth(y, m)) / 7) * 7;
  }
  const out: ArCalendarCell[][] = [];
  for (let i = 0; i < total; i++) {
    const date = shift(first, i);
    const p = splitDate(date)!;
    const cell: ArCalendarCell = {
      date,
      year: p.y,
      month: p.m,
      day: p.d,
      weekday: weekdayOf(p.y, p.m, p.d),
      inMonth: r ? date >= r.start && date <= r.end : p.m === m && p.y === y,
      isToday: date === todayStr.value,
      selected: date === props.modelValue,
      disabled: !!props.disabledDate?.(date),
    };
    if (i % 7 === 0) out.push([]);
    out.at(-1)!.push(cell);
  }
  return out;
});

/* フォーカスの日（Tab で入る1つのマス） */
const grid = ref<HTMLElement | null>(null);
const focusDate = ref<string>(props.modelValue ?? todayStr.value);
watch([ym, () => props.modelValue], () => {
  const { y, m } = ym.value;
  const sel = splitDate(props.modelValue);
  const t = splitDate(todayStr.value)!;
  const cur = splitDate(focusDate.value);
  if (cur && cur.y === y && cur.m === m) return;
  focusDate.value = sel && sel.y === y && sel.m === m ? props.modelValue! : t.y === y && t.m === m ? todayStr.value : formatDate(y, m, 1);
}, { immediate: true });

function choose(c: ArCalendarCell) {
  if (c.disabled) return;
  focusDate.value = c.date;
  if (!c.inMonth) setMonth(c.year, c.month);
  emit("update:modelValue", c.date);
  emit("select", c.date);
}
function moveFocus(date: string) {
  focusDate.value = date;
  const p = splitDate(date)!;
  if (p.y !== ym.value.y || p.m !== ym.value.m) setMonth(p.y, p.m);
  void nextTick(() => grid.value?.querySelector<HTMLElement>(`[data-date="${date}"]`)?.focus());
}
function onKey(e: KeyboardEvent, c: ArCalendarCell) {
  const wd = (c.weekday - props.weekStart + 7) % 7;
  const map: Record<string, () => string> = {
    ArrowLeft: () => shift(c.date, -1),
    ArrowRight: () => shift(c.date, 1),
    ArrowUp: () => shift(c.date, -7),
    ArrowDown: () => shift(c.date, 7),
    Home: () => shift(c.date, -wd),
    End: () => shift(c.date, 6 - wd),
    PageUp: () => addMonths(c.date, e.shiftKey ? -12 : -1),
    PageDown: () => addMonths(c.date, e.shiftKey ? 12 : 1),
  };
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    choose(c);
    return;
  }
  const f = map[e.key];
  if (!f) return;
  e.preventDefault();
  moveFocus(f());
}

/* 年の表示 */
const months = computed(() => Array.from({ length: 12 }, (_, i) => i + 1));
const sel = computed(() => splitDate(props.modelValue));
function chooseMonth(m: number) {
  setMonth(ym.value.y, m);
  setMode("month");
}
function onMonthKey(e: KeyboardEvent, m: number) {
  const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4 };
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    chooseMonth(m);
    return;
  }
  const d = map[e.key];
  if (d === undefined) return;
  e.preventDefault();
  const n = Math.min(12, Math.max(1, m + d));
  setMonth(ym.value.y, n);
  void nextTick(() => grid.value?.querySelector<HTMLElement>(`[data-month="${n}"]`)?.focus());
}
function onModeKey(e: KeyboardEvent) {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
  e.preventDefault();
  const next = mode.value === "month" ? "year" : "month";
  setMode(next);
  void nextTick(() => (e.currentTarget as HTMLElement | null)?.querySelector<HTMLElement>(`[data-mode="${next}"]`)?.focus());
}

const title = computed(() =>
  props.title ??
  (mode.value === "month" ? `${ym.value.y}${props.labels.year}${ym.value.m}${props.labels.month}` : `${ym.value.y}${props.labels.year}`),
);
const eventMap = computed(() => {
  const m = new Map<string, ArCalendarEvent[]>();
  for (const e of props.events) m.set(e.date, [...(m.get(e.date) ?? []), e]);
  return m;
});
const eventsOf = (date: string) => eventMap.value.get(date) ?? [];
const weekendOf = (wd: number) => (props.weekendColors ? (wd === 0 ? "sun" : wd === 6 ? "sat" : undefined) : undefined);
const dayTone = (c: ArCalendarCell) => (props.weekendColors && marksOf(c)?.holiday ? "sun" : weekendOf(c.weekday));
const mini = computed(() => props.size === "mini");
const marksOf = (c: ArCalendarCell) => (c.inMonth || props.variant === "sheet" ? props.cellMarks?.(c.date) : undefined);
const cellState = (c: ArCalendarCell) => {
  const m = marksOf(c);
  return (
    [
      !c.inMonth && "adjacent",
      c.isToday && "today",
      c.selected && "selected",
      c.disabled && "disabled",
      m?.locked && "locked",
      m?.unpublished && "unpublished",
      m?.alert && "alert",
    ]
      .filter(Boolean)
      .join(" ") || undefined
  );
};
const cellLabel = (c: ArCalendarCell) => {
  const m = marksOf(c);
  const L = props.labels;
  const extra = [m?.locked && L.locked, m?.unpublished && L.unpublished, m?.alert && L.alert].filter(Boolean);
  return `${c.year}${L.year}${c.month}${L.month}${c.day}日${extra.length ? `（${extra.join("・")}）` : ""}`;
};
/** board の日付：月の1日は「10/1」のように月を添える。 */
const firstDay = useDesignForm<"inMonth" | "always">("ArCalendar", "firstDay", "inMonth");
const dayText = (c: ArCalendarCell) =>
  c.day === 1 && (firstDay.value === "always" || (props.variant === "board" && c.inMonth)) ? `${c.month}/${c.day}` : String(c.day);
</script>

<template>
  <div data-ar="calendar" data-part="root" :data-mode="mode" :data-variant="variant" :data-size="mini ? 'mini' : undefined">
    <div v-if="showHeader" data-part="header">
      <ArIcon v-if="mini" line name="cal" data-part="heading-icon" />
      <div :id="`${id}-title`" data-part="title" aria-live="polite">{{ title }}</div>
      <div v-if="mini" data-part="extra"><slot name="extra" /></div>
      <div v-else data-part="extra">
        <slot name="extra" />
        <div data-part="year">
          <ArSelect :model-value="ym.y" :options="years" size="sm" block :label="labels.yearSelect" @update:model-value="onYear" />
        </div>
        <div data-part="modes" role="radiogroup" :aria-label="labels.modeSwitch" @keydown="onModeKey">
          <button
            v-for="m in (['month', 'year'] as const)"
            :key="m"
            type="button"
            role="radio"
            data-part="mode"
            :data-mode="m"
            :data-state="mode === m ? 'selected' : undefined"
            :aria-checked="mode === m"
            :tabindex="mode === m ? 0 : -1"
            @click="setMode(m)"
          >
            {{ m === "month" ? labels.month : labels.year }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="mode === 'month'"
      ref="grid"
      data-part="grid"
      role="grid"
      :aria-labelledby="showHeader ? `${id}-title` : undefined"
      :aria-label="label"
    >
      <div data-part="row" data-row="head" role="row">
        <div
          v-for="wd in weekdays"
          :key="wd"
          data-part="weekday"
          role="columnheader"
          :data-weekend="weekendOf(wd)"
        >
          {{ labels.weekdays[wd] }}
        </div>
      </div>
      <div v-for="(w, i) in weeks" :key="i" data-part="row" role="row">
        <div
          v-for="c in w"
          :key="c.date"
          data-part="cell"
          role="gridcell"
          :data-date="c.date"
          :data-state="cellState(c)"
          :data-weekend="dayTone(c)"
          :aria-selected="c.selected"
          :aria-disabled="c.disabled || undefined"
          :aria-current="c.isToday ? 'date' : undefined"
          :aria-label="cellLabel(c)"
          :tabindex="c.date === focusDate ? 0 : -1"
          @click="choose(c)"
          @keydown="onKey($event, c)"
        >
          <template v-if="(c.inMonth || showAdjacent) && variant === 'board'">
            <span data-part="day" :data-size="dayText(c).length > 2 ? 'sm' : undefined">{{ dayText(c) }}</span>
            <ArIcon line v-if="marksOf(c)?.locked" name="lock" data-part="lock" />
            <ArIcon v-if="marksOf(c)?.unpublished" name="eyeoff" data-part="unpublished" />
            <span
              v-for="(ev, k) in c.inMonth ? eventsOf(c.date) : []"
              :key="k"
              data-part="event"
              :data-tone="ev.tone ?? 'event'"
              :style="ev.color ? { '--ar-event-color': ev.color } : undefined"
            >
              <i data-part="dot" aria-hidden="true" /><span>{{ ev.label }}</span>
            </span>
            <div v-if="c.inMonth && $slots.cell" data-part="foot"><slot name="cell" v-bind="c" /></div>
          </template>
          <template v-else-if="mini && (c.inMonth || showAdjacent)">
            <span data-part="day">{{ dayText(c) }}</span>
            <template v-for="(ev, k) in c.inMonth ? eventsOf(c.date) : []" :key="k">
              <span
                data-part="event"
                :data-tone="ev.tone ?? 'event'"
                :title="ev.title"
                :style="ev.color || ev.background ? { color: ev.color, background: ev.background } : undefined"
              >{{ ev.label }}</span>
              <span v-if="ev.note" data-part="note">{{ ev.note }}</span>
            </template>
            <slot v-if="c.inMonth" name="cell" v-bind="c" />
          </template>
          <template v-else-if="c.inMonth || showAdjacent">
            <span data-part="day" :data-size="dayText(c).length > 2 ? 'sm' : undefined">{{ dayText(c) }}</span>
            <div v-if="$slots.cell || eventsOf(c.date).length" data-part="content">
              <span v-for="(ev, k) in eventsOf(c.date)" :key="k" data-part="event" :data-tone="ev.tone ?? 'event'">{{ ev.label }}</span>
              <slot name="cell" v-bind="c" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <div v-else ref="grid" data-part="grid" data-grid="year" role="grid" :aria-labelledby="showHeader ? `${id}-title` : undefined" :aria-label="label">
      <div v-for="r in 3" :key="r" data-part="row" role="row">
        <div
          v-for="m in months.slice((r - 1) * 4, r * 4)"
          :key="m"
          data-part="cell"
          role="gridcell"
          :data-month="m"
          :data-state="
            [m === ym.m && 'current', sel && sel.y === ym.y && sel.m === m && 'selected'].filter(Boolean).join(' ') || undefined
          "
          :aria-selected="m === ym.m"
          :tabindex="m === ym.m ? 0 : -1"
          @click="chooseMonth(m)"
          @keydown="onMonthKey($event, m)"
        >
          <span data-part="day">{{ m }}{{ labels.month }}</span>
          <div v-if="$slots['month-cell']" data-part="content">
            <slot name="month-cell" :year="ym.y" :month="m" :current="m === ym.m" :selected="!!sel && sel.y === ym.y && sel.m === m" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="$slots.footer" data-part="footer"><slot name="footer" /></div>
  </div>
</template>
