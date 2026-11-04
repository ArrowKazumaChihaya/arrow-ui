<script setup lang="ts">
/**
 * ArShiftViewTable 1.0 — シフトの閲覧タブの表（人×日。1日に複数の札・店舗名つき・凡例・今日の列・日ごとの合計の行）。
 * 名前の列と見出しは止まる。表の上に、説明・従業員の検索・列の幅（−／＋）・週／半月／月の切り替えを置ける。
 * size="sm"（auto で幅 600px 未満）はスマホのカードの中の形：名前の列が細く、頭文字の丸を出さず、操作は縦に並ぶ。
 * データを並べるだけで API は呼ばない。期間・列の幅・検索の文字は v-model で受け渡す。
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import ArAvatar from "./ArAvatar.vue";
import ArEmpty from "./ArEmpty.vue";
import ArIcon from "./ArIcon.vue";
import ArSegmented from "./ArSegmented.vue";
import ArHoverTip from "../internal/ArHoverTip.vue";
import ArZoomControl from "./ArZoomControl.vue";
import { useDesignForm, useId } from "../provider/context";
import type {
  ArShiftViewKey,
  ArShiftViewLegendItem,
  ArShiftViewRow,
  ArShiftViewRowSummary,
  ArShiftViewShift,
  ArShiftViewTableLabels,
  ArShiftViewTableProps,
} from "./ArShiftViewTable.contract";

const props = withDefaults(defineProps<ArShiftViewTableProps>(), {
  branches: () => [],
  ownBranchIds: undefined,
  today: undefined,
  holidays: () => [],
  totals: undefined,
  showTotals: true,
  legend: true,
  patterns: () => [],
  note: undefined,
  search: true,
  query: undefined,
  zoom: true,
  columnWidth: undefined,
  minColumnWidth: 88,
  maxColumnWidth: 184,
  columnStep: 16,
  period: undefined,
  periodOptions: undefined,
  maxHeight: undefined,
  size: "auto",
  nameWidth: undefined,
  clickable: false,
  toolbar: true,
  label: "シフト閲覧",
  labels: () => ({}),
});
const emit = defineEmits<{
  "update:query": [query: string];
  "update:columnWidth": [width: number];
  "update:period": [period: string];
  "day-click": [date: string];
  "shift-click": [shift: ArShiftViewShift, row: ArShiftViewRow];
}>();

const id = useId("ar-svt");
const chipForm = useDesignForm<"card" | "labeled">("ArShiftViewTable", "chip", "card");
const timeForm = useDesignForm<"short" | "padded">("ArShiftViewTable", "time", "short");
const dayHeadForm = useDesignForm<"stack" | "inline">("ArShiftViewTable", "dayHead", "stack");
const summaryForm = useDesignForm<"hours" | "days">("ArShiftViewTable", "summary", "hours");
const fillForm = useDesignForm<"stretch" | "fixed">("ArShiftViewTable", "fill", "stretch");
const widthForm = useDesignForm<string>("ArShiftViewTable", "columnWidth", "120");
const nameWidthForm = useDesignForm<string>("ArShiftViewTable", "nameWidth", "");

const hoursText = (m: number) => {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}時間${r}分` : `${h}時間`;
};
const defaults: ArShiftViewTableLabels = {
  employee: "従業員",
  totals: "出勤人数・予定時間",
  workers: (n) => `${n}人`,
  hours: (m) => `${Math.round(m / 6) / 10}時間`,
  summaryHours: (s) => `${hoursText(s.minutes)}・${s.ownDays + s.others}日${s.others ? `（他${s.others}）` : ""}`,
  summaryDays: (s) => `勤務 ${s.days}日`,
  weekdays: ["日", "月", "火", "水", "木", "金", "土"],
  shift: "シフト",
  leave: "有給",
  prevDay: "前日",
  legendOwn: (name) => (name ? `この店舗（${name}）のシフト` : "この店舗のシフト"),
  legendOther: "ほかの店舗・部署のシフト",
  legendLeave: "有給",
  search: "従業員を検索",
  zoom: "列の幅",
  zoomIn: "列を広く",
  zoomOut: "列を狭く",
  period: "表示する期間",
  working: "勤務中",
  absent: "未打刻",
  today: "今日",
  empty: "表示できるシフトがありません",
  emptyDescription: "店舗または表示期間を変更して確認してください。",
  noMatch: (q) => `「${q}」に当てはまる従業員はいません`,
};
const L = computed<ArShiftViewTableLabels>(() => ({ ...defaults, ...props.labels }));

/* ---- 大きさ（auto は部品の幅で決める） ---- */
const root = ref<HTMLElement | null>(null);
const measured = ref<"md" | "sm">("md");
let ro: ResizeObserver | null = null;
onMounted(() => {
  if (typeof ResizeObserver === "undefined" || !root.value) return;
  ro = new ResizeObserver((entries) => {
    const w = entries[0]?.contentRect.width ?? 0;
    if (w > 0) measured.value = w < 600 ? "sm" : "md";
  });
  ro.observe(root.value);
});
onBeforeUnmount(() => ro?.disconnect());
const size = computed(() => (props.size === "auto" ? measured.value : props.size));

/* ---- 列の幅・検索・期間（v-model。渡されなければ中で持つ） ---- */
const innerWidth = ref<number | null>(null);
const cw = computed(() => props.columnWidth ?? innerWidth.value ?? (Number(widthForm.value) || 120));
function setWidth(v: number) {
  const next = Math.min(props.maxColumnWidth, Math.max(props.minColumnWidth, v));
  innerWidth.value = next;
  emit("update:columnWidth", next);
}
const innerQuery = ref("");
const q = computed(() => props.query ?? innerQuery.value);
function onQuery(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  innerQuery.value = v;
  emit("update:query", v);
}
const innerPeriod = ref<string | null>(null);
watch(
  () => props.period,
  () => (innerPeriod.value = null),
);
const periodValue = computed(() => props.period ?? innerPeriod.value ?? String(props.periodOptions?.[0]?.value ?? ""));
function onPeriod(v: string | number) {
  innerPeriod.value = String(v);
  emit("update:period", String(v));
}
const showSearch = computed(() => (typeof props.search === "number" ? props.rows.length >= props.search : props.search));

/* ---- 日付 ---- */
const holidaySet = computed(() => new Set(props.holidays));
function parts(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const wd = new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1).getDay();
  return { d: d ?? 0, wd };
}
const days = computed(() =>
  props.dates.map((date) => {
    const { d, wd } = parts(date);
    const tone = wd === 0 || holidaySet.value.has(date) ? "sun" : wd === 6 ? "sat" : undefined;
    return { date, d, w: L.value.weekdays[wd] ?? "", tone, today: date === props.today };
  }),
);

/* ---- 時刻 ---- */
function clock(min: number) {
  const prev = min < 0;
  const m = prev ? min + 1440 : min;
  const h = Math.floor(m / 60);
  const mm = String(((m % 60) + 60) % 60).padStart(2, "0");
  const hh = timeForm.value === "padded" ? String(h).padStart(2, "0") : String(h);
  return `${prev ? L.value.prevDay : ""}${hh}:${mm}`;
}
const sep = computed(() => (timeForm.value === "padded" ? "〜" : "–"));
const timeText = (t: { start: number; end: number }) => `${clock(t.start)}${sep.value}${clock(t.end)}`;

/* ---- シフトの並べ方 ---- */
const ownSet = computed(() => (props.ownBranchIds ? new Set(props.ownBranchIds.map(String)) : null));
const branchName = (s: ArShiftViewShift) =>
  s.branchName ?? (s.branchId != null ? props.branches.find((b) => String(b.id) === String(s.branchId))?.name : undefined) ?? "";
const isOther = (s: ArShiftViewShift) => !!ownSet.value && s.branchId != null && !ownSet.value.has(String(s.branchId));
const scopeOf = (s: ArShiftViewShift) => (s.kind === "leave" ? "leave" : isOther(s) ? "other" : "own");
const minutesOf = (s: ArShiftViewShift) =>
  s.kind === "leave" ? 0 : (s.minutes ?? (s.times ?? []).reduce((a, t) => a + Math.max(0, t.end - t.start), 0));
function compare(a: ArShiftViewShift, b: ArShiftViewShift) {
  const sa = a.times?.[0]?.start;
  const sb = b.times?.[0]?.start;
  if (sa == null && sb != null) return 1;
  if (sa != null && sb == null) return -1;
  if (sa != null && sb != null && sa !== sb) return sa - sb;
  return String(a.id).localeCompare(String(b.id), "ja", { numeric: true });
}
const byRowDate = computed(() => {
  const map = new Map<string, ArShiftViewShift[]>();
  for (const s of props.shifts) {
    const k = `${String(s.rowKey)}|${s.date}`;
    const list = map.get(k);
    if (list) list.push(s);
    else map.set(k, [s]);
  }
  for (const list of map.values()) list.sort(compare);
  return map;
});
const cellShifts = (row: ArShiftViewKey, date: string) => byRowDate.value.get(`${String(row)}|${date}`) ?? [];
function chipStyle(s: ArShiftViewShift) {
  return scopeOf(s) === "own" && s.color ? { "--ar-svt-chip": s.color } : undefined;
}
const chipTip = (s: ArShiftViewShift) =>
  s.tip ??
  [branchName(s), s.kind === "leave" ? (s.text ?? L.value.leave) : (s.times ?? []).map((t) => `${clock(t.start)}〜${clock(t.end)}`).join(" ")]
    .filter(Boolean)
    .join("　");

/* ---- 行 ---- */
const dateSet = computed(() => new Set(props.dates));
function summaryOf(row: ArShiftViewRow): ArShiftViewRowSummary {
  let minutes = 0;
  const all = new Set<string>();
  const own = new Set<string>();
  const others = new Set<string>();
  for (const s of props.shifts) {
    if (String(s.rowKey) !== String(row.key) || !dateSet.value.has(s.date) || s.kind === "leave") continue;
    minutes += minutesOf(s);
    all.add(s.date);
    (isOther(s) ? others : own).add(s.date);
  }
  return { minutes, days: all.size, ownDays: own.size, others: others.size };
}
const subOf = (row: ArShiftViewRow) => {
  if (row.sub !== undefined) return row.sub;
  const s = summaryOf(row);
  return summaryForm.value === "days" ? L.value.summaryDays(s) : L.value.summaryHours(s);
};
const visibleRows = computed(() => {
  const text = q.value.trim().toLowerCase();
  if (!text) return props.rows;
  return props.rows.filter((r) => `${r.name} ${r.keywords ?? ""}`.toLowerCase().includes(text));
});
const avatarText = (r: ArShiftViewRow) => (typeof r.avatar === "string" ? r.avatar : r.name.trim().charAt(0));

/* ---- 合計の行 ---- */
const foot = computed(() =>
  props.dates.map((date) => {
    const given = props.totals?.[date];
    if (given) return given;
    const people = new Set<string>();
    let minutes = 0;
    for (const s of props.shifts) {
      if (s.date !== date || s.kind === "leave") continue;
      people.add(String(s.rowKey));
      minutes += minutesOf(s);
    }
    return { workers: people.size, minutes };
  }),
);

/* ---- 凡例 ---- */
const legendItems = computed<readonly ArShiftViewLegendItem[]>(() => {
  if (props.legend === false) return [];
  if (Array.isArray(props.legend)) return props.legend;
  const scopes = new Set(props.shifts.map(scopeOf));
  const ownName = props.ownBranchIds?.length
    ? (props.branches.find((b) => String(b.id) === String(props.ownBranchIds![0]))?.name ?? "")
    : "";
  const ownColor = props.shifts.find((s) => scopeOf(s) === "own" && s.color)?.color;
  const out: ArShiftViewLegendItem[] = [];
  if (scopes.has("own") && ownSet.value) out.push({ kind: "own", label: L.value.legendOwn(ownName), color: ownColor });
  if (scopes.has("other")) out.push({ kind: "other", label: L.value.legendOther });
  if (scopes.has("leave")) out.push({ kind: "leave", label: L.value.legendLeave });
  for (const p of props.patterns) out.push({ kind: "pattern", label: p.label, color: p.color });
  return out;
});
const swatchStyle = (it: ArShiftViewLegendItem) => (it.color ? { "--ar-svt-chip": it.color } : undefined);

/* ---- 幅 ---- */
const nameW = computed(() => props.nameWidth ?? (Number(nameWidthForm.value) || (size.value === "sm" ? 132 : 188)));
const tableStyle = computed(() => ({
  "--ar-svt-cw": `${cw.value}px`,
  "--ar-svt-nw": `${nameW.value}px`,
  minWidth: `${nameW.value + props.dates.length * cw.value}px`,
}));
const scrollStyle = computed(() =>
  props.maxHeight === undefined ? undefined : { maxHeight: typeof props.maxHeight === "number" ? `${props.maxHeight}px` : props.maxHeight },
);
const colSpan = computed(() => props.dates.length + 1);

function dayState(d: { today: boolean }) {
  return d.today ? "today" : undefined;
}
</script>

<template>
  <div
    ref="root"
    data-ar="shift-view-table"
    data-part="root"
    :data-size="size"
    :data-chip="chipForm"
    :data-fill="fillForm"
    :data-clickable="clickable || undefined"
  >
    <div v-if="toolbar && (note || showSearch || zoom || periodOptions?.length || $slots.toolbar)" data-part="toolbar">
      <span v-if="note" data-part="note"><ArIcon name="store" size="sm" />{{ note }}</span>
      <label v-if="showSearch" data-part="search">
        <ArIcon line name="search" size="sm" data-part="search-icon" />
        <input
          data-part="search-input"
          type="search"
          :value="q"
          :placeholder="L.search"
          :aria-label="L.search"
          :aria-controls="`${id}-table`"
          @input="onQuery"
        />
      </label>
      <ArZoomControl
        v-if="zoom"
        data-part="zoom"
        :value="`${cw}px`"
        :out-disabled="cw <= minColumnWidth"
        :in-disabled="cw >= maxColumnWidth"
        :size="size === 'sm' ? 'sm' : 'md'"
        :label="L.zoom"
        :out-label="L.zoomOut"
        :in-label="L.zoomIn"
        @out="setWidth(cw - columnStep)"
        @in="setWidth(cw + columnStep)"
      />
      <ArSegmented
        v-if="periodOptions?.length"
        :model-value="periodValue"
        :options="periodOptions"
        :label="L.period"
        @update:model-value="onPeriod"
      />
      <slot name="toolbar" />
    </div>

    <div data-part="scroll" :style="scrollStyle" tabindex="0" :aria-labelledby="`${id}-caption`" role="region">
      <table :id="`${id}-table`" data-part="table" :style="tableStyle">
        <caption :id="`${id}-caption`" data-part="caption">{{ label }}</caption>
        <colgroup>
          <col data-part="col-name" :style="{ width: `${nameW}px` }" />
          <col v-for="d in days" :key="d.date" :style="fillForm === 'fixed' ? { width: `${cw}px` } : undefined" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" data-part="corner">{{ L.employee }}</th>
            <th
              v-for="d in days"
              :key="d.date"
              scope="col"
              data-part="day"
              :data-tone="d.tone"
              :data-state="dayState(d)"
              :aria-current="d.today ? 'date' : undefined"
            >
              <component
                :is="clickable ? 'button' : 'span'"
                :type="clickable ? 'button' : undefined"
                data-part="day-label"
                :aria-label="`${d.date}（${d.w}）${d.today ? `・${L.today}` : ''}`"
                @click="clickable && emit('day-click', d.date)"
              >
                <template v-if="dayHeadForm === 'inline'">
                  <span data-part="day-num">{{ d.d }} ({{ d.w }})</span>
                </template>
                <template v-else>
                  <span data-part="day-num">{{ d.d }}</span>
                  <small data-part="weekday">{{ d.w }}</small>
                </template>
              </component>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in visibleRows" :key="row.key">
            <th scope="row" data-part="name">
              <span data-part="name-box">
              <slot name="name" :row="row" :sub="subOf(row)">
                <ArAvatar
                  v-if="row.avatar !== false"
                  data-part="avatar"
                  size="sm"
                  :text="avatarText(row)"
                  :seed="row.avatarSeed ?? row.key"
                />
                <span data-part="name-text">
                  <b data-part="name-label"
                    ><em
                      v-if="row.live"
                      data-part="live"
                      :data-state="row.live"
                      role="img"
                      :aria-label="row.live === 'working' ? L.working : L.absent"
                      :data-tip="row.live === 'working' ? L.working : L.absent"
                    />{{ row.name }}</b
                  >
                  <small v-if="subOf(row)" data-part="name-sub">{{ subOf(row) }}</small>
                </span>
              </slot>
              </span>
            </th>
            <td
              v-for="d in days"
              :key="d.date"
              data-part="cell"
              :data-tone="d.tone"
              :data-state="dayState(d)"
            >
              <component
                :is="clickable ? 'button' : 'span'"
                v-for="s in cellShifts(row.key, d.date)"
                :key="String(s.id)"
                :type="clickable ? 'button' : undefined"
                data-part="chip"
                :data-scope="scopeOf(s)"
                :style="chipStyle(s)"
                :data-tip="chipTip(s)"
                @click="clickable && emit('shift-click', s, row)"
              >
                <slot
                  name="chip"
                  :shift="s"
                  :row="row"
                  :date="d.date"
                  :branch="branchName(s)"
                  :time="(s.times ?? []).map(timeText).join(' ')"
                >
                  <template v-if="chipForm === 'labeled'">
                    <span v-if="branchName(s)" data-part="chip-branch">{{ branchName(s) }}</span>
                    <span data-part="chip-subject">{{ s.kind === "leave" ? (s.text ?? L.leave) : L.shift }}</span>
                    <template v-if="s.kind !== 'leave'">
                      <span v-for="(t, i) in s.times ?? []" :key="i" data-part="chip-time">{{ timeText(t) }}</span>
                    </template>
                  </template>
                  <template v-else>
                    <b v-if="s.kind === 'leave' || s.text" data-part="chip-time">{{ s.text ?? L.leave }}</b>
                    <template v-else>
                      <b v-for="(t, i) in s.times ?? []" :key="i" data-part="chip-time">{{ timeText(t) }}</b>
                    </template>
                    <small v-if="branchName(s)" data-part="chip-branch">{{ branchName(s) }}</small>
                  </template>
                </slot>
              </component>
            </td>
          </tr>
          <tr v-if="!visibleRows.length">
            <td :colspan="colSpan" data-part="empty">
              <slot name="empty">
                <ArEmpty size="sm" :icon="q ? 'search' : 'cal'">
                  <template v-if="q">{{ L.noMatch(q) }}</template>
                  <template v-else>{{ L.empty }}<br v-if="L.emptyDescription" />{{ L.emptyDescription }}</template>
                </ArEmpty>
              </slot>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="showTotals && rows.length">
          <tr>
            <th scope="row" data-part="foot-label">{{ L.totals }}</th>
            <td v-for="(t, i) in foot" :key="days[i]?.date" data-part="foot" :data-tone="days[i]?.tone" :data-state="days[i] && dayState(days[i]!)">
              <span data-part="foot-workers">{{ L.workers(t.workers) }}</span>
              <small data-part="foot-hours">{{ L.hours(t.minutes) }}</small>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="legendItems.length || $slots.legend" data-part="legend">
      <span v-for="(it, i) in legendItems" :key="i" data-part="legend-item" :data-kind="it.kind">
        <i data-part="swatch" :data-kind="it.kind" :style="swatchStyle(it)" aria-hidden="true" />{{ it.label }}
      </span>
      <slot name="legend" />
    </div>
    <ArHoverTip :root="root" />
  </div>
</template>
