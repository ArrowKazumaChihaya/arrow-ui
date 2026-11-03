<script setup lang="ts">
/**
 * 日付のパネルの中身（ArDatePicker の中だけで使う）。根を持たない（部位を入れ物の直下に並べる）。
 * 月の切り替え・曜日の見出し・6週の日・「今日」「決める」。範囲なら間を淡いテーマ色にする。
 * キーボード：←→↑↓で日、PageUp/PageDown で月（Shift で年）、Home/End で週の端、Enter・Space で選ぶ。
 */
import { computed, nextTick, ref, watch } from "vue";
import ArButton from "../components/ArButton.vue";
import ArIcon from "../components/ArIcon.vue";
import { addDays, addMonths, dayNumber, formatDate, splitDate, todayString, weekdayOf, daysInMonth } from "../components/date";

defineOptions({ inheritAttrs: false });
const props = defineProps<{
  /** 選んでいる日（範囲なら start・end）。 */
  start: string | null;
  end: string | null;
  range: boolean;
  /** 範囲で、始まりだけ決まって終わりを選んでいる途中。 */
  picking: boolean;
  min?: string;
  max?: string;
  showFooter: boolean;
  labels: { prev: string; next: string; today: string; ok: string; title: (y: number, m: number) => string; weekdays: readonly string[] };
  baseId: string;
}>();
const emit = defineEmits<{ pick: [date: string]; today: []; ok: [] }>();

const today = todayString();
const focusDate = ref(props.start ?? today);
const view = ref(splitDate(focusDate.value)!);
watch(
  () => props.start,
  (s) => {
    if (s && !props.picking) {
      focusDate.value = s;
      view.value = splitDate(s)!;
    }
  },
);
const hover = ref<string | null>(null);
const grid = ref<HTMLElement | null>(null);

const weeks = computed(() => {
  const { y, m } = view.value;
  const first = formatDate(y, m, 1);
  const lead = weekdayOf(y, m, 1);
  const start = addDays(first, -lead);
  const count = Math.ceil((lead + daysInMonth(y, m)) / 7) * 7;
  const days = Array.from({ length: count }, (_, i) => addDays(start, i));
  return Array.from({ length: count / 7 }, (_, w) => days.slice(w * 7, w * 7 + 7));
});

const lo = computed(() => {
  if (!props.range || !props.start) return null;
  const other = props.picking ? hover.value : props.end;
  if (!other) return null;
  return dayNumber(other) < dayNumber(props.start) ? [other, props.start] : [props.start, other];
});

function outOfRange(d: string) {
  return (props.min && dayNumber(d) < dayNumber(props.min)) || (props.max && dayNumber(d) > dayNumber(props.max));
}

function cell(d: string) {
  const s = splitDate(d)!;
  const n = dayNumber(d);
  const w = weekdayOf(s.y, s.m, s.d);
  const outside = s.m !== view.value.m;
  const ends = [props.start, props.range ? (props.picking ? null : props.end) : null].filter(Boolean) as string[];
  const selected = ends.includes(d);
  const between = !!lo.value && n > dayNumber(lo.value[0]!) && n < dayNumber(lo.value[1]!);
  const edge = !!lo.value && !selected && (d === lo.value[0] || d === lo.value[1]);
  return {
    d,
    n: s.d,
    selected,
    state:
      [
        outside && "outside",
        d === today && "today",
        selected && "selected",
        (between || edge) && "in-range",
        lo.value && d === lo.value[0] && "range-start",
        lo.value && d === lo.value[1] && "range-end",
        outOfRange(d) && "disabled",
      ]
        .filter(Boolean)
        .join(" ") || undefined,
    kind: w === 0 ? "sun" : w === 6 ? "sat" : undefined,
  };
}

function move(months: number) {
  const t = view.value.y * 12 + view.value.m - 1 + months;
  view.value = { y: Math.floor(t / 12), m: (t % 12) + 1, d: 1 };
  const f = splitDate(focusDate.value)!;
  focusDate.value = formatDate(view.value.y, view.value.m, Math.min(f.d, daysInMonth(view.value.y, view.value.m)));
}

async function focusCell() {
  await nextTick();
  grid.value?.querySelector<HTMLElement>(`[data-date="${focusDate.value}"]`)?.focus();
}

function setFocus(d: string) {
  focusDate.value = d;
  const s = splitDate(d)!;
  if (s.y !== view.value.y || s.m !== view.value.m) view.value = s;
  if (props.picking) hover.value = d;
  focusCell();
}

function onKey(e: KeyboardEvent) {
  const d = focusDate.value;
  const s = splitDate(d)!;
  const w = weekdayOf(s.y, s.m, s.d);
  const map: Record<string, () => string> = {
    ArrowLeft: () => addDays(d, -1),
    ArrowRight: () => addDays(d, 1),
    ArrowUp: () => addDays(d, -7),
    ArrowDown: () => addDays(d, 7),
    Home: () => addDays(d, -w),
    End: () => addDays(d, 6 - w),
    PageUp: () => addMonths(d, e.shiftKey ? -12 : -1),
    PageDown: () => addMonths(d, e.shiftKey ? 12 : 1),
  };
  if (map[e.key]) {
    e.preventDefault();
    setFocus(map[e.key]!());
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (!outOfRange(d)) emit("pick", d);
  }
}

function pick(d: string) {
  if (outOfRange(d)) return;
  focusDate.value = d;
  emit("pick", d);
}

function goToday() {
  focusDate.value = today;
  view.value = splitDate(today)!;
  emit("today");
}

defineExpose({ focusCell, goTo: setFocus });
</script>

<template>
  <div data-part="head">
    <button type="button" data-part="nav" data-dir="prev" :aria-label="labels.prev" @click="move(-1)"><ArIcon name="cl" size="sm" /></button>
    <b :id="`${baseId}-title`" data-part="title" aria-live="polite">{{ labels.title(view.y, view.m) }}</b>
    <button type="button" data-part="nav" data-dir="next" :aria-label="labels.next" @click="move(1)"><ArIcon name="cr" size="sm" /></button>
  </div>
  <div ref="grid" data-part="grid" role="grid" :aria-labelledby="`${baseId}-title`" @keydown="onKey" @mouseleave="hover = null">
    <div role="row" data-part="row">
      <span v-for="(w, i) in labels.weekdays" :key="w" role="columnheader" data-part="weekday" :data-kind="i === 0 ? 'sun' : i === 6 ? 'sat' : undefined">
        {{ w }}
      </span>
    </div>
    <div v-for="(week, wi) in weeks" :key="wi" role="row" data-part="row">
      <button
        v-for="c in week.map(cell)"
        :key="c.d"
        type="button"
        role="gridcell"
        data-part="day"
        :data-date="c.d"
        :data-state="c.state"
        :data-kind="c.kind"
        :tabindex="c.d === focusDate ? 0 : -1"
        :aria-selected="c.selected"
        :aria-current="c.d === today ? 'date' : undefined"
        :aria-disabled="c.state?.includes('disabled') || undefined"
        :aria-label="c.d"
        @click="pick(c.d)"
        @mouseenter="picking && (hover = c.d)"
        @focus="focusDate = c.d"
      >
        {{ c.n }}
      </button>
    </div>
  </div>
  <div v-if="showFooter" data-part="foot">
    <ArButton tone="ghost" size="sm" @click="goToday">{{ labels.today }}</ArButton>
    <ArButton tone="primary" size="sm" @click="emit('ok')">{{ labels.ok }}</ArButton>
  </div>
</template>
