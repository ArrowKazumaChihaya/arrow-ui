<script setup lang="ts">
/**
 * ArShiftGrid 1.1 — シフトのテーブル（日×人の格子）。シフトのテーブルタブの週・半月・月の表。
 * マス（パターン色の淡い面と左の線。1日に2つのシフトは1行に1つずつ）とチャート（6時〜24時の帯。ドラッグで移動・伸縮・ほかの人／日へ移す・空いたマスで追加）。
 * 見出し（曜日の色・今日の印・鍵・目の印・押すと day-open）、イベントの行、人数と募集に対する不足の行、名前の列と見出しの固定、
 * 左のパターンの一覧（検索つき・マスへドラッグ）、列の幅の −／＋、ドラッグでの選択・オートフィル・右クリックの操作。
 * キーボード：表にフォーカスして ↑↓←→（Shift で範囲）、⌘C／Ctrl+C コピー、⌘X 切り取り、⌘V 貼り付け、⌘Z 元に戻す、⌘⇧Z やり直す、Delete 削除、Enter 開く、Escape 解除。
 * 部品はデータを書き換えない。操作はすべてイベント（保存は製品）。マスは数百あるので、マスごとの部品は作らず、イベントは表でまとめて受ける。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import ArAvatar from "./ArAvatar.vue";
import ArZoomControl from "./ArZoomControl.vue";
import ArEmpty from "./ArEmpty.vue";
import ArSegmented from "./ArSegmented.vue";
import ArFloat from "../internal/ArFloat.vue";
import ShiftGridTip from "../internal/shiftGridTip.vue";
import ArHoverTip from "../internal/ArHoverTip.vue";
import { useDesignForm, useId } from "../provider/context";
import {
  applyDrag,
  clock,
  fillRect,
  inkOn,
  inRect,
  isMac,
  norm,
  pct,
  spanLong,
  spanShort,
  weekdayOf,
  workMinutes,
  type ChartDrag,
  type Rect,
  type TipRow,
} from "../internal/shiftGrid";
import type {
  ArShiftGridCell,
  ArShiftGridDay,
  ArShiftGridKey,
  ArShiftGridLabels,
  ArShiftGridMember,
  ArShiftGridPattern,
  ArShiftGridProps,
  ArShiftGridRange,
  ArShiftGridShow,
  ArShiftGridSpot,
  ArShiftGridTime,
} from "./ArShiftGrid.contract";

const props = withDefaults(defineProps<ArShiftGridProps>(), {
  patterns: () => [],
  mode: undefined,
  columnWidth: undefined,
  zoom: () => ({}),
  today: undefined,
  show: () => ({}),
  editable: true,
  chartRange: () => [360, 1440] as const,
  snap: 15,
  patternPanel: undefined,
  patternEdit: true,
  controls: false,
  contextMenu: true,
  maxHeight: undefined,
  fit: undefined,
  compact: false,
  platform: undefined,
  label: "シフトのテーブル",
  labels: () => ({}),
});

const emit = defineEmits<{
  "update:mode": [mode: "cell" | "chart"];
  "update:columnWidth": [width: number | null];
  select: [range: ArShiftGridRange | null];
  copy: [range: ArShiftGridRange];
  cut: [range: ArShiftGridRange];
  paste: [payload: { mode: "copy" | "cut"; source: ArShiftGridRange; target: ArShiftGridRange }];
  delete: [range: ArShiftGridRange];
  undo: [];
  redo: [];
  autofill: [payload: { source: ArShiftGridRange; target: ArShiftGridRange }];
  open: [spot: ArShiftGridSpot & { cell?: ArShiftGridCell }];
  "pattern-drop": [payload: { pattern: ArShiftGridPattern; targets: ArShiftGridSpot[] }];
  "pattern-edit": [];
  avail: [payload: ArShiftGridSpot & { avail: NonNullable<ArShiftGridCell["avail"]> }];
  "day-open": [day: ArShiftGridDay];
  "day-chart": [day: ArShiftGridDay];
  "day-outside": [day: ArShiftGridDay];
  "chart-move": [payload: { from: ArShiftGridSpot; to: ArShiftGridSpot; cell: ArShiftGridCell }];
  "chart-change": [payload: ArShiftGridSpot & { cell: ArShiftGridCell; times: ArShiftGridTime[]; breaks: ArShiftGridTime[] }];
  "chart-create": [payload: ArShiftGridSpot & { time: ArShiftGridTime }];
  refuse: [payload: { reason: "locked" | "occupied" | "readonly"; spot: ArShiftGridSpot }];
  reorder: [payload: { from: number; to: number; keys: ArShiftGridKey[] }];
}>();

const L = computed<ArShiftGridLabels>(() => ({
  name: "名前",
  events: "イベント",
  count: "シフト人数",
  shortage: "募集に対して不足",
  countCell: "{n}人",
  shortageCell: "不足{n}",
  shortageTip: "募集 {need}名に対して {count}名",
  none: "—",
  locked: "勤怠ロック中",
  unpublished: "非公開",
  leave: "有給",
  leaveAll: "有給全日",
  avail: "提出",
  availShort: "希",
  availWide: "希望 {t}",
  availHint: "押すとシフトにできます",
  shift: "シフト",
  break: "休憩",
  punch: "勤怠",
  noShift: "シフトなし",
  noPattern: "パターンなし",
  weekdays: ["日", "月", "火", "水", "木", "金", "土"],
  date: "{m}月{d}日",
  dayOpen: "{m}月{d}日の勤務メンバーを見る",
  dayChart: "シフトチャート",
  hours: "{h}時間",
  hoursMin: "{h}時間{m}分",
  workDays: "{n}日勤務",
  offDays: "{n}日休み",
  shortcutTitle: "ショートカットキー",
  copy: "コピー",
  cut: "切り取り",
  paste: "貼り付け",
  undo: "元に戻す",
  redo: "やり直す",
  delete: "削除",
  selectHint: "マスを押して選択（Shiftキーで範囲）",
  selected: "{n}マスを選択中",
  chartTitle: "チャートの操作",
  chartHints: ["バーをドラッグで移動", "両端で開始・終了を変える", "ほかの人・日へもドラッグで移せる", "空いているマスをドラッグで追加", "15分きざみ"],
  patternSearch: "パターンを検索",
  patternEdit: "パターンを編集",
  patternNone: "「{q}」に合うパターンはありません",
  patternHint: "表のマスへドラッグして置きます",
  patternDrag: "マスへドラッグして置く（選んだマスがあれば Enter で置く）",
  zoom: "列の幅",
  zoomOut: "列を狭く",
  zoomIn: "列を広く",
  modeLabel: "表示のしかた",
  modeCell: "マス",
  modeChart: "チャート",
  add: "追加",
  edit: "編集",
  reorder: "ドラッグして並べ替え",
  resizeStart: "開始時刻を変える",
  resizeEnd: "終了時刻を変える",
  ...props.labels,
}));
const fmt = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

const headForm = useDesignForm<"date" | "button">("ArShiftGrid", "head", "date");
const fitForm = useDesignForm<"scroll" | "scale">("ArShiftGrid", "fit", "scroll");
const cellForm = useDesignForm<"tint" | "fill">("ArShiftGrid", "cell", "tint");
const tipForm = useDesignForm<"line" | "section">("ArShiftGrid", "tip", "line");
const hintForm = useDesignForm<"kbd" | "text">("ArShiftGrid", "hint", "kbd");
const summaryForm = useDesignForm<"dots" | "paren">("ArShiftGrid", "summary", "dots");

const SHOW: ArShiftGridShow = { avatar: true, code: false, hours: true, days: true, off: true, count: true, shortage: true, events: true, locked: true, unpublished: true, leave: true, avail: true, hints: true };
const show = computed<ArShiftGridShow>(() => ({ ...SHOW, ...props.show }));
const uid = useId("ar-sg");

/* ---------- 表示・列の幅 ---------- */
const localMode = ref<"cell" | "chart">(props.mode ?? "cell");
watch(() => props.mode, (m) => { if (m) localMode.value = m; });
const mode = computed(() => localMode.value);
const localW = ref<number | null>(props.columnWidth ?? null);
watch(() => props.columnWidth, (w) => { localW.value = w ?? null; });

const zoomRange = computed(() =>
  mode.value === "chart" ? { min: 80, max: 280, step: 20, ...props.zoom.chart } : { min: 28, max: 140, step: 8, ...props.zoom.cell },
);
const root = ref<HTMLElement | null>(null);
const viewport = ref<HTMLElement | null>(null);
const gridEl = ref<HTMLElement | null>(null);
const viewW = ref(0);
const nameW = ref(168);
const gridH = ref(0);
const n = computed(() => Math.max(1, props.days.length));
const autoW = computed(() => {
  if (fitForm.value === "scale") return mode.value === "chart" ? 136 : n.value >= 28 ? 34 : 136;
  // 枠に合わせる（remix の既定）：枠の幅から名前の列を引いて日の数で割る。範囲の下限より狭くなるときだけ下限にして横に動かす。
  const min = props.compact && mode.value === "cell" ? Math.max(zoomRange.value.min, 50) : zoomRange.value.min;
  if (!viewW.value) return min;
  return Math.max(min, Math.floor((viewW.value - nameW.value) / n.value));
});
const colW = computed(() => localW.value ?? autoW.value);
const fitMode = computed(() => props.fit ?? (fitForm.value === "scale" && localW.value == null && !(n.value > 7 && n.value < 28) ? "scale" : "scroll"));
const contentW = computed(() => nameW.value + n.value * colW.value);
const scale = computed(() => (fitMode.value === "scale" && viewW.value ? Math.min(1, viewW.value / contentW.value) : 1));
const canZoomOut = computed(() => colW.value > zoomRange.value.min);
const canZoomIn = computed(() => colW.value < zoomRange.value.max);
function setWidth(w: number | null) {
  localW.value = w;
  emit("update:columnWidth", w);
}
function zoomOut() {
  if (canZoomOut.value) setWidth(Math.max(zoomRange.value.min, colW.value - zoomRange.value.step));
}
function zoomIn() {
  if (canZoomIn.value) setWidth(Math.min(zoomRange.value.max, colW.value + zoomRange.value.step));
}
/** 「枠に合わせる」に戻す（columnWidth を null にする）。 */
function fitWidth() {
  setWidth(null);
}
function setMode(m: string | number) {
  const next = m === "chart" ? "chart" : "cell";
  if (next === localMode.value) return;
  localMode.value = next;
  emit("update:mode", next);
  setWidth(null);
  clearSelection();
}

let ro: ResizeObserver | null = null;
function measure() {
  if (viewport.value) viewW.value = viewport.value.clientWidth;
  const nh = root.value?.querySelector<HTMLElement>("[data-part='head-date']>[data-part='name-head']");
  if (nh?.offsetWidth) nameW.value = nh.offsetWidth;
  else if (root.value) {
    const v = parseFloat(getComputedStyle(root.value).getPropertyValue("--sg-name"));
    if (v) nameW.value = v;
  }
  if (gridEl.value) gridH.value = gridEl.value.offsetHeight;
}
onMounted(() => {
  measure();
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(measure);
    if (viewport.value) ro.observe(viewport.value);
    if (gridEl.value) ro.observe(gridEl.value);
  }
});

/* ---------- 日・人・マスの見え方 ---------- */
const patternMap = computed(() => new Map(props.patterns.map((p) => [String(p.key), p])));
const cellOf = (m: ArShiftGridMember, date: string): ArShiftGridCell | undefined => props.cells[String(m.key)]?.[date];
const hasShift = (c: ArShiftGridCell | undefined) => !!c?.times?.length;
const isLeave = (c: ArShiftGridCell | undefined) => !!c?.leave;
const wide = computed(() => colW.value >= 100);

const dayViews = computed(() =>
  props.days.map((d, i) => {
    const wd = d.weekday ?? weekdayOf(d.date);
    const m = Number(d.date.slice(5, 7));
    const dn = Number(d.date.slice(8, 10));
    const count = d.count ?? props.members.filter((mm) => hasShift(cellOf(mm, d.date))).length;
    const shortage = d.shortage ?? (d.need != null ? Math.max(0, d.need - count) : 0);
    return {
      d,
      i,
      wd,
      w: L.value.weekdays[wd] ?? "",
      tone: d.holiday || wd === 0 ? "sun" : wd === 6 ? "sat" : undefined,
      weekend: wd === 0 || wd === 6,
      today: !!props.today && d.date === props.today,
      num: String(dn),
      num2: d.date.slice(8, 10),
      m,
      dn,
      locked: show.value.locked && !!d.locked,
      unpub: show.value.unpublished && !!d.unpublished,
      count,
      shortage,
      shortTip: shortage && d.need != null ? fmt(L.value.shortageTip, { need: d.need, count }) : "",
      label: fmt(L.value.dayOpen, { m, d: dn }),
      dateText: `${fmt(L.value.date, { m, d: dn })}（${L.value.weekdays[wd] ?? ""}）`,
    };
  }),
);
type DayView = (typeof dayViews.value)[number];
const anyEvents = computed(() => show.value.events && props.days.some((d) => d.events?.length));
const anyShortage = computed(() => show.value.shortage && props.days.some((d) => d.need != null || d.shortage != null));

function hm(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? fmt(L.value.hoursMin, { h, m }) : fmt(L.value.hours, { h });
}
const memberViews = computed(() =>
  props.members.map((m, r) => {
    const parts: string[] = [];
    if (m.summary == null && summaryForm.value === "paren" && m.minutes != null && show.value.hours) {
      // 今の ARROW の list_period_summary：「184時間0分 23日勤務（8日休み）」
      parts.push(`${Math.floor(m.minutes / 60)}時間${m.minutes % 60}分 ${m.workDays ?? 0}日勤務（${m.offDays ?? 0}日休み）`);
    } else if (m.summary == null) {
      if (show.value.hours && m.minutes != null) parts.push(hm(m.minutes));
      if (show.value.days && m.workDays != null) parts.push(fmt(L.value.workDays, { n: m.workDays }));
      if (show.value.off && m.offDays != null) parts.push(fmt(L.value.offDays, { n: m.offDays }));
    } else if (m.summary) parts.push(m.summary);
    return { m, r, parts, initial: m.initial ?? m.name.slice(0, 1) };
  }),
);

interface CellView {
  kind: "shift" | "leave" | "empty";
  color?: string;
  custom: boolean;
  lines: string[];
  detail: TipRow[];
  avail?: NonNullable<ArShiftGridCell["avail"]>;
  availText: string;
  tip: TipRow[];
  aria: string;
  locked: boolean;
  outside: boolean;
  readonly: boolean;
  times: ArShiftGridTime[];
  breaks: ArShiftGridTime[];
  barLabel: string;
  style: Record<string, string>;
}
const cellViews = computed<CellView[][]>(() => {
  const fill = cellForm.value === "fill";
  return props.members.map((m) =>
    dayViews.value.map((dv) => {
      const c = cellOf(m, dv.d.date);
      const leave = show.value.leave && isLeave(c) && !hasShift(c);
      const shift = hasShift(c);
      const p = c?.pattern != null ? patternMap.value.get(String(c.pattern)) : undefined;
      const times = [...(c?.times ?? [])];
      const breaks = [...(c?.breaks ?? [])];
      const avail = show.value.avail && !shift && !leave && c?.avail?.times.length ? c.avail : undefined;
      const leaveTime = typeof c?.leave === "object" ? c.leave.time : undefined;
      const leaveLabel = (typeof c?.leave === "object" && c.leave.label) || L.value.leave;
      const tip: TipRow[] = [{ values: [`${m.name}　${dv.dateText}`] }];
      if (shift) {
        if (p && fill) tip.push({ label: p.name, values: [] });
        tip.push({ label: L.value.shift, values: times.map((t) => spanLong(t)) });
        if (breaks.length) tip.push({ label: L.value.break, values: breaks.map((t) => spanLong(t)) });
        if (c?.punches?.length) tip.push({ label: L.value.punch, values: c.punches.map((t) => spanLong(t)) });
      }
      if (show.value.leave && isLeave(c)) tip.push(leaveTime ? { label: leaveLabel, values: [spanLong(leaveTime)] } : { label: L.value.leaveAll, values: [] });
      if (avail) {
        tip.push({ label: L.value.avail, values: avail.times.map((t) => spanLong(t)) });
        if (avail.note) tip.push({ values: [avail.note] });
        if (props.editable) tip.push({ values: [L.value.availHint] });
      }
      if (dv.locked) tip.push({ values: [L.value.locked] });
      const tipRows: TipRow[] = c?.tip ? c.tip.split("\n").map((v) => ({ values: [v] })) : tip.length > 1 ? tip : [];
      const color = leave ? undefined : p?.color;
      const style: Record<string, string> = {};
      if (fill) {
        const bg = leave || (shift && !color) ? "#808080" : color;
        if (bg) {
          style["--sg-c"] = bg;
          style["--sg-ink"] = inkOn(bg);
        }
      } else if (color) style["--sg-c"] = color;
      let lines: string[] = [];
      let detail: TipRow[] = [];
      if (fill) {
        if (wide.value && shift) {
          if (p) detail.push({ label: p.name, values: [] });
          detail.push({ label: L.value.shift, values: times.map((t) => spanLong(t)) });
          if (breaks.length) detail.push({ label: L.value.break, values: breaks.map((t) => spanLong(t)) });
          if (c?.punches?.length) detail.push({ label: L.value.punch, values: c.punches.map((t) => spanLong(t)) });
        }
      } else if (leave) lines = colW.value >= 40 ? [leaveLabel] : [];
      else if (shift && colW.value >= 64) lines = times.map(spanShort);
      const availText = !avail
        ? ""
        : fill
          ? ""
          : colW.value >= 44 || mode.value === "chart"
            ? fmt(L.value.availWide, { t: spanShort({ start: avail.times[0]!.start, end: avail.times[avail.times.length - 1]!.end }) })
            : L.value.availShort;
      if (fill && avail && wide.value) detail = [{ label: "勤務可能", values: avail.times.map((t) => spanLong(t)) }];
      return {
        kind: shift ? "shift" : leave ? "leave" : "empty",
        color,
        custom: shift && !p,
        lines,
        detail,
        avail,
        availText,
        tip: tipRows,
        aria: (tipRows.length ? tipRows : tip).map((r) => [r.label, ...r.values].filter(Boolean).join(" ")).join("、") || `${m.name}　${dv.dateText}　${L.value.noShift}`,
        locked: dv.locked || !!dv.d.locked,
        outside: !!dv.d.outside,
        readonly: !!c?.readonly,
        times,
        breaks,
        barLabel: leave ? leaveLabel : times.map(spanShort).join(" / "),
        style,
      };
    }),
  );
});
const cv = (r: number, c: number) => cellViews.value[r]![c]!;
const spot = (r: number, c: number): ArShiftGridSpot => ({ member: props.members[r]!.key, date: props.days[c]!.date, row: r, col: c });
const rawCell = (r: number, c: number) => cellOf(props.members[r]!, props.days[c]!.date);

/* ---------- 選ぶ・コピー・貼り付け ---------- */
const anchorPos = ref<{ r: number; c: number } | null>(null);
const headPos = ref<{ r: number; c: number } | null>(null);
const rect = computed<Rect | null>(() => (anchorPos.value && headPos.value ? norm(anchorPos.value, headPos.value) : null));
const selecting = ref(false);
const filling = ref(false);
const fillTo = ref<{ r: number; c: number } | null>(null);
const fillR = computed(() => (filling.value && rect.value && fillTo.value ? fillRect(rect.value, fillTo.value) : null));
const clip = ref<{ mode: "copy" | "cut"; rect: Rect } | null>(null);

function rangeOf(x: Rect): ArShiftGridRange {
  return {
    ...x,
    members: props.members.slice(x.r0, x.r1 + 1).map((m) => m.key),
    dates: props.days.slice(x.c0, x.c1 + 1).map((d) => d.date),
  };
}
let lastSel = "";
watch(rect, (x) => {
  const k = x ? `${x.r0},${x.r1},${x.c0},${x.c1}` : "";
  if (k === lastSel) return;
  lastSel = k;
  emit("select", x ? rangeOf(x) : null);
});
function clearSelection() {
  anchorPos.value = null;
  headPos.value = null;
  clip.value = null;
  menu.value = null;
}
function selectAt(r: number, c: number, extend = false) {
  if (extend && anchorPos.value) headPos.value = { r, c };
  else {
    anchorPos.value = { r, c };
    headPos.value = { r, c };
  }
}
function edges(x: Rect | null, r: number, c: number) {
  if (!inRect(x, r, c) || !x) return undefined;
  const e = [];
  if (r === x.r0) e.push("top");
  if (r === x.r1) e.push("bottom");
  if (c === x.c0) e.push("left");
  if (c === x.c1) e.push("right");
  return e.join(" ") || "inner";
}

/* ---------- チャートのドラッグ ---------- */
const drag = shallowRef<ChartDrag | null>(null);
const span = computed(() => props.chartRange[1] - props.chartRange[0]);
function dragView(r: number, c: number) {
  const d = drag.value;
  if (!d) return null;
  const other = d.toRow !== d.row || d.toCol !== d.col;
  if (other && d.row === r && d.col === c) return { state: "origin" as const };
  if (other && d.toRow === r && d.toCol === c) {
    const bad = targetRefusal(r, c) != null;
    return { state: bad ? ("drop-ng" as const) : ("drop-ok" as const), times: bad ? null : d.times, breaks: bad ? null : d.breaks };
  }
  if (!other && d.row === r && d.col === c) return { state: "drag" as const, times: d.next, breaks: d.nextBreaks };
  return null;
}
function targetRefusal(r: number, c: number): "locked" | "occupied" | "readonly" | null {
  const v = cv(r, c);
  if (v.locked || v.outside) return "locked";
  if (v.readonly) return "readonly";
  if (v.kind !== "empty") return "occupied";
  return null;
}
const bar = (t: ArShiftGridTime) => {
  const l = pct(t.start, props.chartRange);
  return { left: `${l}%`, width: `${Math.max(0.6, pct(t.end, props.chartRange) - l)}%` };
};
function barsOf(r: number, c: number) {
  const v = cv(r, c);
  const dv = dragView(r, c);
  if (dv?.state === "origin") return { times: [] as ArShiftGridTime[], breaks: [] as ArShiftGridTime[], state: dv.state };
  if (dv && "times" in dv) return { times: dv.times ?? [], breaks: dv.breaks ?? [], state: dv.state };
  return { times: v.times, breaks: v.breaks, state: undefined };
}
function cellAtPoint(x: number, y: number): { r: number; c: number } | null {
  const el = (document.elementFromPoint?.(x, y) as HTMLElement | null)?.closest?.("[data-part='cell']") as HTMLElement | null;
  if (!el || !root.value?.contains(el)) return null;
  return { r: Number(el.dataset.r), c: Number(el.dataset.c) };
}
function startBar(e: PointerEvent, r: number, c: number, kind: ChartDrag["kind"]) {
  if (!props.editable || e.button !== 0) return;
  const v = cv(r, c);
  if (v.locked || v.outside || v.readonly) {
    emit("refuse", { reason: v.readonly ? "readonly" : "locked", spot: spot(r, c) });
    return;
  }
  if (kind === "new" && v.kind !== "empty") return;
  if (kind !== "new" && v.kind !== "shift") return;
  e.preventDefault();
  e.stopPropagation();
  const track = ((e.currentTarget as HTMLElement).closest("[data-part='track']") as HTMLElement | null)?.querySelector<HTMLElement>("[data-part='bar-track']");
  const box = track?.getBoundingClientRect();
  const width = box?.width || 100;
  const left = box?.left ?? 0;
  const anchor = Math.round((props.chartRange[0] + ((e.clientX - left) / width) * span.value) / props.snap) * props.snap;
  const times = kind === "new" ? [{ start: anchor, end: anchor + props.snap }] : v.times.map((t) => ({ ...t }));
  drag.value = { kind, row: r, col: c, toRow: r, toCol: c, x0: e.clientX, width, anchor, times, breaks: v.breaks.map((t) => ({ ...t })), next: times, nextBreaks: v.breaks, moved: false };
  tip.value?.hide();
  anchorPos.value = null;
  headPos.value = null;
  window.addEventListener("pointermove", onBarMove);
  window.addEventListener("pointerup", onBarUp, { once: true });
}
function onBarMove(e: PointerEvent) {
  const d = drag.value;
  if (!d) return;
  const dm = Math.round((((e.clientX - d.x0) / d.width) * span.value) / props.snap) * props.snap;
  let to = { r: d.row, c: d.col };
  if (d.kind === "move") to = cellAtPoint(e.clientX, e.clientY) ?? { r: d.toRow, c: d.toCol };
  const other = to.r !== d.row || to.c !== d.col;
  const lo = d.kind === "new" ? props.chartRange[0] : 0;
  const hi = d.kind === "new" ? props.chartRange[1] : 1800;
  const nx = other ? { times: d.times, breaks: d.breaks } : applyDrag(d, dm, lo, hi, props.snap);
  drag.value = { ...d, toRow: to.r, toCol: to.c, next: nx.times, nextBreaks: nx.breaks, moved: d.moved || dm !== 0 || other };
}
function onBarUp() {
  window.removeEventListener("pointermove", onBarMove);
  const d = drag.value;
  drag.value = null;
  if (!d) return;
  const from = spot(d.row, d.col);
  const cell = rawCell(d.row, d.col);
  if (d.kind === "move" && (d.toRow !== d.row || d.toCol !== d.col)) {
    const why = targetRefusal(d.toRow, d.toCol);
    if (why) emit("refuse", { reason: why, spot: spot(d.toRow, d.toCol) });
    else if (cell) emit("chart-move", { from, to: spot(d.toRow, d.toCol), cell });
    return;
  }
  if (d.kind === "new") {
    const t = d.next[0];
    if (t && t.end - t.start >= 30) emit("chart-create", { ...from, time: { ...t } });
    return;
  }
  const same = JSON.stringify(d.next) === JSON.stringify(d.times);
  if (!same && cell) emit("chart-change", { ...from, cell, times: d.next, breaks: d.nextBreaks });
}

/* ---------- マウス（表でまとめて受ける） ---------- */
function posOf(e: Event): { r: number; c: number; el: HTMLElement } | null {
  const el = (e.target as HTMLElement | null)?.closest?.("[data-part='cell']") as HTMLElement | null;
  if (!el) return null;
  return { r: Number(el.dataset.r), c: Number(el.dataset.c), el };
}
function onDown(e: PointerEvent) {
  if (e.button !== 0) return;
  const t = e.target as HTMLElement;
  if (t.closest("[data-part='fill-handle']")) {
    if (!rect.value) return;
    e.preventDefault();
    filling.value = true;
    fillTo.value = null;
    listenSel();
    return;
  }
  const p = posOf(e);
  if (!p) return;
  const day = props.days[p.c]!;
  if (day.outside) {
    emit("day-outside", day);
    return;
  }
  if (mode.value === "chart") {
    selectAt(p.r, p.c);
    return;
  }
  if (!props.editable) return;
  e.preventDefault();
  viewport.value?.focus({ preventScroll: true });
  menu.value = null;
  selectAt(p.r, p.c, e.shiftKey);
  selecting.value = !e.shiftKey;
  listenSel();
}
function listenSel() {
  tip.value?.hide();
  window.addEventListener("pointermove", onSelMove);
  window.addEventListener("pointerup", onSelUp, { once: true });
}
function onSelMove(e: PointerEvent) {
  const p = cellAtPoint(e.clientX, e.clientY);
  if (!p) return;
  if (filling.value) {
    if (!fillTo.value || fillTo.value.r !== p.r || fillTo.value.c !== p.c) fillTo.value = p;
  } else if (selecting.value && headPos.value && (headPos.value.r !== p.r || headPos.value.c !== p.c)) headPos.value = p;
}
function onSelUp() {
  window.removeEventListener("pointermove", onSelMove);
  if (filling.value) {
    const f = fillR.value;
    const src = rect.value;
    filling.value = false;
    fillTo.value = null;
    if (f && src) {
      emit("autofill", { source: rangeOf(src), target: rangeOf(f) });
      anchorPos.value = { r: f.r0, c: f.c0 };
      headPos.value = { r: f.r1, c: f.c1 };
    }
  }
  selecting.value = false;
}
function onOver(e: PointerEvent) {
  if (selecting.value || filling.value || drag.value) return;
  const p = posOf(e);
  if (!p) return;
  const v = cv(p.r, p.c);
  if (v.tip.length) tip.value?.show(p.el, v.tip, p.r <= 1);
  else tip.value?.hide();
}
function onLeave() {
  tip.value?.hide();
}
function onDbl(e: MouseEvent) {
  const p = posOf(e);
  if (p && props.editable && !props.days[p.c]!.outside) openAt(p.r, p.c);
}
function openAt(r: number, c: number) {
  emit("open", { ...spot(r, c), cell: rawCell(r, c) });
}

/* ---------- 右クリックの操作 ---------- */
const menu = ref<{ el: HTMLElement; r: number; c: number } | null>(null);
const menuPanel = ref<HTMLElement | null>(null);
function onContext(e: MouseEvent) {
  if (!props.contextMenu || !props.editable || mode.value !== "cell") return;
  const p = posOf(e);
  if (!p || props.days[p.c]!.outside) return;
  e.preventDefault();
  if (!inRect(rect.value, p.r, p.c)) selectAt(p.r, p.c);
  tip.value?.hide();
  menu.value = { el: p.el, r: p.r, c: p.c };
  nextTick(() => (document.querySelector(`#${uid}-menu [role='menuitem']`) as HTMLElement | null)?.focus());
}
const menuItems = computed(() => {
  if (!menu.value) return [];
  const has = cv(menu.value.r, menu.value.c).kind !== "empty";
  return [
    { k: "open", n: has ? L.value.edit : L.value.add, ic: has ? ("pen" as const) : ("plus" as const), dis: false },
    { k: "copy", n: L.value.copy, ic: "copy" as const, dis: false },
    { k: "cut", n: L.value.cut, ic: "cut" as const, dis: false },
    { k: "paste", n: L.value.paste, ic: "paste" as const, dis: !clip.value },
    { k: "delete", n: L.value.delete, ic: "trash" as const, dis: false },
  ];
});
function runMenu(k: string) {
  const m = menu.value;
  menu.value = null;
  if (!m) return;
  if (k === "open") openAt(rect.value?.r0 ?? m.r, rect.value?.c0 ?? m.c);
  else act(k as "copy" | "cut" | "paste" | "delete");
  viewport.value?.focus({ preventScroll: true });
}
function onMenuKey(e: KeyboardEvent) {
  const items = [...(menuPanel.value?.querySelectorAll<HTMLElement>("[role='menuitem']:not([disabled])") ?? document.querySelectorAll<HTMLElement>(`#${uid}-menu [role='menuitem']:not([disabled])`))];
  const i = items.indexOf(document.activeElement as HTMLElement);
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
  }
}

/* ---------- キーボード ---------- */
function act(k: "copy" | "cut" | "paste" | "delete") {
  const x = rect.value;
  if (!x || mode.value !== "cell" || !props.editable) return;
  if (k === "copy" || k === "cut") {
    clip.value = { mode: k, rect: x };
    if (k === "copy") emit("copy", rangeOf(x));
    else emit("cut", rangeOf(x));
  } else if (k === "delete") emit("delete", rangeOf(x));
  else if (k === "paste" && clip.value) {
    const s = clip.value.rect;
    const h = Math.max(s.r1 - s.r0, x.r1 - x.r0);
    const w = Math.max(s.c1 - s.c0, x.c1 - x.c0);
    const target = { r0: x.r0, c0: x.c0, r1: Math.min(props.members.length - 1, x.r0 + h), c1: Math.min(props.days.length - 1, x.c0 + w) };
    emit("paste", { mode: clip.value.mode, source: rangeOf(s), target: rangeOf(target) });
    if (clip.value.mode === "cut") clip.value = null;
    anchorPos.value = { r: target.r0, c: target.c0 };
    headPos.value = { r: target.r1, c: target.c1 };
  }
}
function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement;
  if (t !== viewport.value && t.closest("input, textarea, select, [contenteditable='true'], button")) return;
  const k = e.key.toLowerCase();
  const mod = e.metaKey || e.ctrlKey;
  const mv: Record<string, [number, number]> = { arrowup: [-1, 0], arrowdown: [1, 0], arrowleft: [0, -1], arrowright: [0, 1] };
  if (mv[k]) {
    e.preventDefault();
    const [dr, dc] = mv[k]!;
    const cur = headPos.value ?? { r: 0, c: 0 };
    const r = Math.max(0, Math.min(props.members.length - 1, headPos.value ? cur.r + dr : 0));
    const c = Math.max(0, Math.min(props.days.length - 1, headPos.value ? cur.c + dc : 0));
    selectAt(r, c, e.shiftKey && !!anchorPos.value);
    nextTick(() => document.getElementById(`${uid}-${r}-${c}`)?.scrollIntoView?.({ block: "nearest", inline: "nearest" }));
    return;
  }
  if (k === "escape") {
    if (rect.value || clip.value) e.preventDefault();
    clearSelection();
    return;
  }
  if (k === "enter" && rect.value) {
    e.preventDefault();
    if (props.editable && !props.days[rect.value.c0]!.outside) openAt(rect.value.r0, rect.value.c0);
    return;
  }
  if (mode.value !== "cell" || !props.editable) return;
  if (mod && k === "c") act("copy");
  else if (mod && k === "x") act("cut");
  else if (mod && k === "v") act("paste");
  else if (mod && k === "z") {
    e.preventDefault();
    if (e.shiftKey) emit("redo");
    else emit("undo");
  } else if ((k === "delete" || k === "backspace") && rect.value) {
    e.preventDefault();
    act("delete");
  } else return;
}
const activeId = computed(() => (headPos.value ? `${uid}-${headPos.value.r}-${headPos.value.c}` : undefined));

/* ---------- パターンの一覧 ---------- */
const q = ref("");
const shownPatterns = computed(() => props.patterns.filter((p) => !q.value || p.name.includes(q.value)));
const panelOn = computed(() => props.patternPanel ?? props.patterns.length > 0);
const dragPat = ref<ArShiftGridPattern | null>(null);
const dropKey = ref<string | null>(null);
const patTime = (p: ArShiftGridPattern) => (p.times?.length ? `${clock(p.times[0]!.start)}〜${clock(p.times[p.times.length - 1]!.end)}` : "");
function patStart(e: DragEvent, p: ArShiftGridPattern) {
  dragPat.value = p;
  tip.value?.hide();
  try {
    e.dataTransfer?.setData("text/plain", String(p.key));
    if (e.dataTransfer) e.dataTransfer.effectAllowed = "copy";
  } catch {
    /* 古い端末 */
  }
}
function patEnd() {
  dragPat.value = null;
  dropKey.value = null;
}
function onDragOver(e: DragEvent) {
  if (!dragPat.value && dragRow.value == null) return;
  if (dragRow.value != null) return;
  const p = posOf(e);
  if (!p) return;
  e.preventDefault();
  const k = `${p.r}-${p.c}`;
  if (dropKey.value !== k) dropKey.value = k;
}
function onDrop(e: DragEvent) {
  const pat = dragPat.value;
  const p = posOf(e);
  patEnd();
  if (!pat || !p) return;
  e.preventDefault();
  const why = cv(p.r, p.c).locked || cv(p.r, p.c).outside ? "locked" : cv(p.r, p.c).readonly ? "readonly" : null;
  if (why) emit("refuse", { reason: why, spot: spot(p.r, p.c) });
  else emit("pattern-drop", { pattern: pat, targets: [spot(p.r, p.c)] });
}
function patKey(e: KeyboardEvent, p: ArShiftGridPattern) {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  const x = rect.value;
  if (!x || !props.editable) return;
  const targets: ArShiftGridSpot[] = [];
  for (let r = x.r0; r <= x.r1; r++) for (let c = x.c0; c <= x.c1; c++) if (!cv(r, c).locked && !cv(r, c).outside && !cv(r, c).readonly) targets.push(spot(r, c));
  if (targets.length) emit("pattern-drop", { pattern: p, targets });
}
function patOver(e: PointerEvent, p: ArShiftGridPattern) {
  const rows: TipRow[] = [];
  if (p.times?.length) rows.push({ label: L.value.shift, values: p.times.map((t) => spanLong(t)) });
  if (p.breaks?.length) rows.push({ label: L.value.break, values: p.breaks.map((t) => spanLong(t)) });
  if (rows.length) tip.value?.show(e.currentTarget as HTMLElement, rows, true);
}

/* ---------- 並べ替え ---------- */
const dragRow = ref<number | null>(null);
const dropRow = ref<number | null>(null);
function rowStart(e: DragEvent, r: number) {
  dragRow.value = r;
  tip.value?.hide();
  try {
    e.dataTransfer?.setData("text/plain", String(props.members[r]!.key));
    if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
  } catch {
    /* 古い端末 */
  }
}
function rowOver(e: DragEvent, r: number) {
  if (dragRow.value == null) return;
  e.preventDefault();
  dropRow.value = r;
}
function rowDrop(e: DragEvent, r: number) {
  const from = dragRow.value;
  dragRow.value = null;
  dropRow.value = null;
  if (from == null || from === r) return;
  e.preventDefault();
  const keys = props.members.map((m) => m.key);
  const [k] = keys.splice(from, 1);
  keys.splice(r, 0, k!);
  emit("reorder", { from, to: r, keys });
}
function rowEnd() {
  dragRow.value = null;
  dropRow.value = null;
}

/* ---------- マスの状態 ---------- */
function stateOf(r: number, c: number) {
  const s: string[] = [];
  if (inRect(rect.value, r, c)) s.push("selected");
  if (fillR.value && inRect(fillR.value, r, c) && !inRect(rect.value, r, c)) s.push("fill");
  if (dropKey.value === `${r}-${c}`) s.push("drop");
  const dv = drag.value ? dragView(r, c) : null;
  if (dv) s.push(dv.state);
  return s.join(" ") || undefined;
}
const fillHere = (r: number, c: number) =>
  props.editable && mode.value === "cell" && !selecting.value && !!rect.value && rect.value.r1 === r && rect.value.c1 === c;

/* ---------- 表の下の案内 ---------- */
const mac = computed(() => (props.platform ? props.platform === "mac" : isMac()));
const keys = computed(() => {
  const m = mac.value;
  const kbd = hintForm.value === "kbd";
  const mk = (k: string, shift = false) => (kbd ? (m ? `⌘${shift ? "⇧" : ""}${k}` : `Ctrl+${shift ? "Shift+" : ""}${k}`) : m ? `⌘+${shift ? "Shift+" : ""}${k}` : `Ctrl+${shift ? "Shift+" : ""}${k}`);
  return [
    { n: L.value.copy, k: mk("C") },
    { n: L.value.cut, k: mk("X") },
    { n: L.value.paste, k: mk("V") },
    { n: L.value.undo, k: mk("Z") },
    { n: L.value.redo, k: mk("Z", true) },
    { n: L.value.delete, k: "Delete" },
  ];
});
const status = computed(() => {
  if (mode.value === "chart") return "";
  const x = rect.value;
  return x ? fmt(L.value.selected, { n: (x.r1 - x.r0 + 1) * (x.c1 - x.c0 + 1) }) : L.value.selectHint;
});

const tip = ref<InstanceType<typeof ShiftGridTip> | null>(null);
const axis = computed(() => {
  const [a, b] = props.chartRange;
  const out: { m: number; t: string }[] = [];
  for (let m = a; m <= b; m += 360) out.push({ m, t: String(Math.floor(m / 60)) });
  return out;
});
const gridStyle = computed(() => ({
  "--sg-col": `${colW.value}px`,
  "--sg-n": String(n.value),
  transform: scale.value < 1 ? `scale(${scale.value})` : undefined,
  width: scale.value < 1 ? `${contentW.value}px` : undefined,
}));
const scalerStyle = computed(() => (scale.value < 1 && gridH.value ? { height: `${Math.ceil(gridH.value * scale.value)}px` } : undefined));
watch([() => props.days.length, () => props.members.length, colW, mode], () => nextTick(measure));
onBeforeUnmount(() => {
  ro?.disconnect();
  window.removeEventListener("pointermove", onSelMove);
  window.removeEventListener("pointermove", onBarMove);
});

defineExpose({ zoomIn, zoomOut, fitWidth, setMode, clearSelection, columnWidth: colW, canZoomIn, canZoomOut, selection: rect });
const dayOf = (dv: DayView) => dv.d;
</script>

<template>
  <div
    ref="root"
    data-ar="shift-grid"
    data-part="root"
    :data-mode="mode"
    :data-compact="compact ? '' : undefined"
    :data-summary="memberViews.some((x) => x.parts.length) ? '' : undefined"
    :data-wide="wide ? '' : undefined"
    :data-fit="fitMode"
    :data-editable="editable ? '' : undefined"
    :data-dragging="drag ? '' : undefined"
  >
    <div v-if="controls || $slots.toolbar" data-part="toolbar">
      <slot name="toolbar" :zoom-in="zoomIn" :zoom-out="zoomOut" :column-width="colW" :can-zoom-in="canZoomIn" :can-zoom-out="canZoomOut" :fit-width="fitWidth" :fitted="localW == null" :mode="mode" :set-mode="setMode" />
      <template v-if="controls">
        <ArZoomControl
          data-part="zoom"
          :value="`${colW}px`"
          :out-disabled="!canZoomOut"
          :in-disabled="!canZoomIn"
          :size="compact ? 'sm' : 'md'"
          :label="L.zoom"
          :out-label="L.zoomOut"
          :in-label="L.zoomIn"
          @out="zoomOut"
          @in="zoomIn"
        />
        <ArSegmented
          :model-value="mode"
          :label="L.modeLabel"
          :options="[
            { value: 'cell', label: L.modeCell },
            { value: 'chart', label: L.modeChart },
          ]"
          @update:model-value="setMode"
        />
      </template>
    </div>
    <div data-part="layout">
      <aside v-if="panelOn" data-part="patterns" :aria-label="L.patternSearch">
        <slot name="patterns" :patterns="shownPatterns" :query="q">
          <button v-if="patternEdit && editable" type="button" data-part="pattern-edit" @click="emit('pattern-edit')"><ArIcon name="pen" size="sm" />{{ L.patternEdit }}</button>
          <label data-part="pattern-search"><ArIcon name="search" size="sm" line /><input v-model="q" type="text" :placeholder="L.patternSearch" :aria-label="L.patternSearch" /></label>
          <div
            v-for="p in shownPatterns"
            :key="p.key"
            data-part="pattern"
            role="button"
            tabindex="0"
            :draggable="editable ? 'true' : 'false'"
            :data-tip="L.patternDrag"
            :aria-label="`${p.name} ${patTime(p)}`"
            @dragstart="patStart($event, p)"
            @dragend="patEnd"
            @keydown="patKey($event, p)"
            @pointerenter="patOver($event, p)"
            @pointerleave="onLeave"
          >
            <span data-part="pattern-swatch" :style="{ background: p.color }" aria-hidden="true" />
            <span><b data-part="pattern-name">{{ p.name }}</b><small v-if="patTime(p)" data-part="pattern-time">{{ patTime(p) }}</small></span>
          </div>
          <ArEmpty v-if="q && !shownPatterns.length" data-part="pattern-none" role="status" size="sm" icon="search" :text="fmt(L.patternNone, { q })" />
          <span v-if="editable" data-part="pattern-hint"><ArIcon name="info" size="sm" line />{{ L.patternHint }}</span>
        </slot>
      </aside>
      <div data-part="main">
        <div
          ref="viewport"
          data-part="viewport"
          role="grid"
          tabindex="0"
          :aria-label="label"
          aria-multiselectable="true"
          :aria-rowcount="members.length + 1"
          :aria-colcount="days.length + 1"
          :aria-activedescendant="activeId"
          :style="maxHeight ? { maxHeight } : undefined"
          @keydown="onKey"
          @pointerdown="onDown"
          @pointerover="onOver"
          @pointerleave="onLeave"
          @dblclick="onDbl"
          @contextmenu="onContext"
          @dragover="onDragOver"
          @drop="onDrop"
        >
          <div data-part="scaler" :style="scalerStyle">
            <div ref="gridEl" data-part="grid" role="presentation" :style="gridStyle">
              <div data-part="head-date" role="row">
                <div data-part="name-head" role="columnheader">{{ headForm === "date" ? L.name : "" }}</div>
                <div
                  v-for="dv in dayViews"
                  :key="dv.d.date"
                  data-part="date"
                  role="columnheader"
                  tabindex="0"
                  :data-tip="dv.label"
                  :aria-label="`${dv.label}${dv.locked ? '・' + L.locked : ''}${dv.unpub ? '・' + L.unpublished : ''}`"
                  :data-tone="dv.tone"
                  :data-today="dv.today ? '' : undefined"
                  :data-unpublished="dv.unpub ? '' : undefined"
                  @click="emit('day-open', dayOf(dv))"
                  @keydown.enter.prevent="emit('day-open', dayOf(dv))"
                >
                  <span v-if="headForm === 'button'" data-part="date-icons">
                    <ArIcon v-if="dv.unpub" name="eyeoff" size="sm" :label="L.unpublished" />
                    <ArIcon v-if="dv.locked" name="lock" size="sm" :label="L.locked" />
                  </span>
                  <span data-part="date-num">{{ headForm === "button" ? (wide ? `${dv.num2} (${dv.w})` : dv.num2) : dv.num }}</span>
                  <small v-if="!(headForm === 'button' && wide)" data-part="date-week">{{ dv.w }}</small>
                </div>
              </div>
              <div data-part="head-sub" role="row">
                <div data-part="name-head" role="columnheader">{{ headForm === "button" ? L.name : "" }}</div>
                <div v-for="dv in dayViews" :key="dv.d.date" data-part="status" role="columnheader" :data-today="dv.today ? '' : undefined">
                  <button v-if="headForm === 'button'" type="button" data-part="chart-button" :aria-label="`${dv.dateText} ${L.dayChart}`" @click="emit('day-chart', dayOf(dv))">
                    <ArIcon name="chart" size="sm" /><span v-if="wide">{{ L.dayChart }}</span>
                  </button>
                  <span v-if="mode === 'chart'" data-part="axis" aria-hidden="true"><span v-for="a in axis" :key="a.m">{{ a.t }}</span></span>
                  <template v-if="headForm === 'date'">
                    <ArIcon v-if="dv.locked" name="lock" size="sm" :label="L.locked" />
                    <ArIcon v-if="dv.unpub" name="eyeoff" size="sm" :label="L.unpublished" />
                  </template>
                </div>
              </div>
              <div v-if="anyEvents" data-part="head-event" role="row">
                <div data-part="name-head" role="rowheader">{{ L.events }}</div>
                <div v-for="dv in dayViews" :key="dv.d.date" data-part="status" role="gridcell" :data-today="dv.today ? '' : undefined">
                  <span v-for="(ev, i) in dv.d.events ?? []" :key="i" data-part="event" :data-tip="ev.time ? `${ev.name}　${ev.time}` : ev.name" :style="ev.color ? { '--sg-ev': ev.color } : undefined">
                    <i data-part="event-dot" aria-hidden="true" /><span>{{ ev.name }}</span>
                  </span>
                </div>
              </div>
              <div v-for="mv in memberViews" :key="mv.m.key" data-part="row" role="row" :aria-rowindex="mv.r + 2">
                <div
                  data-part="name"
                  role="rowheader"
                  :data-state="dropRow === mv.r ? 'drop' : undefined"
                  @dragover="rowOver($event, mv.r)"
                  @drop.stop="rowDrop($event, mv.r)"
                >
                  <span v-if="editable" data-part="grip" draggable="true" :data-tip="L.reorder" :aria-label="L.reorder" @dragstart="rowStart($event, mv.r)" @dragend="rowEnd">
                    <ArIcon name="grip" size="sm" line />
                  </span>
                  <ArAvatar v-if="show.avatar" data-part="avatar" size="sm" :seed="mv.r" :color="mv.m.avatarTone" :src="mv.m.avatar" :text="mv.initial" />
                  <span data-part="member">
                    <span v-if="show.code && mv.m.code" data-part="code">{{ mv.m.code }}</span>
                    <b data-part="member-name">{{ mv.m.name }}</b>
                    <small v-if="mv.parts.length" data-part="summary"><span v-for="(t, i) in mv.parts" :key="i">{{ t }}</span></small>
                  </span>
                </div>
                <div
                  v-for="(dv, c) in dayViews"
                  :id="`${uid}-${mv.r}-${c}`"
                  :key="dv.d.date"
                  data-part="cell"
                  role="gridcell"
                  :data-r="mv.r"
                  :data-c="c"
                  :data-kind="cv(mv.r, c).kind"
                  :data-pattern="cv(mv.r, c).custom ? 'none' : undefined"
                  :data-weekend="dv.weekend ? '' : undefined"
                  :data-today="dv.today ? '' : undefined"
                  :data-locked="cv(mv.r, c).locked && show.locked ? '' : undefined"
                  :data-outside="dv.d.outside ? '' : undefined"
                  :data-state="stateOf(mv.r, c)"
                  :data-edge="edges(rect, mv.r, c)"
                  :data-clip="clip && inRect(clip.rect, mv.r, c) ? clip.mode : undefined"
                  :data-clip-edge="clip ? edges(clip.rect, mv.r, c) : undefined"
                  :aria-selected="inRect(rect, mv.r, c) ? 'true' : 'false'"
                  :aria-label="cv(mv.r, c).aria"
                  :style="cv(mv.r, c).style"
                >
                  <template v-if="mode === 'cell'">
                    <span v-if="cv(mv.r, c).kind !== 'empty'" data-part="shift" :data-leave="cv(mv.r, c).kind === 'leave' ? '' : undefined">
                      <span v-for="(l, i) in cv(mv.r, c).lines" :key="i" data-part="line">{{ l }}</span>
                      <span v-for="(d, i) in cv(mv.r, c).detail" :key="'d' + i" data-part="detail">
                        <b data-part="detail-label">{{ d.label }}</b><span v-for="(v, j) in d.values" :key="j" data-part="line">{{ v }}</span>
                      </span>
                    </span>
                    <button
                      v-else-if="cv(mv.r, c).avail"
                      type="button"
                      data-part="avail"
                      :data-wide="wide ? '' : undefined"
                      :aria-label="`${L.avail} ${cv(mv.r, c).avail!.times.map((t) => spanLong(t)).join('、')}`"
                      @pointerdown.stop
                      @click="emit('avail', { ...spot(mv.r, c), avail: cv(mv.r, c).avail! })"
                    >
                      <template v-if="cv(mv.r, c).availText">{{ cv(mv.r, c).availText }}</template>
                      <template v-else-if="cv(mv.r, c).detail.length">
                        <span v-for="(d, i) in cv(mv.r, c).detail" :key="'a' + i" data-part="detail"><b data-part="detail-label">{{ d.label }}</b><span v-for="(v, j) in d.values" :key="j" data-part="line">{{ v }}</span></span>
                      </template>
                      <template v-else>○</template>
                    </button>
                  </template>
                  <span
                    v-else
                    data-part="track"
                    :data-kind="cv(mv.r, c).kind"
                    :data-state="barsOf(mv.r, c).state"
                    :data-empty="cv(mv.r, c).kind === 'empty' && !cv(mv.r, c).locked && !cv(mv.r, c).outside && editable ? '' : undefined"
                    @pointerdown="startBar($event, mv.r, c, 'new')"
                  >
                    <span data-part="bar-track">
                      <button
                        v-for="(t, i) in cv(mv.r, c).avail?.times ?? []"
                        :key="'av' + i"
                        type="button"
                        data-part="avail-bar"
                        :style="bar(t)"
                        :aria-label="`${L.avail} ${spanLong(t)}`"
                        @pointerdown.stop
                        @click="emit('avail', { ...spot(mv.r, c), avail: cv(mv.r, c).avail! })"
                      />
                      <i v-if="cv(mv.r, c).kind === 'leave'" data-part="bar" data-leave="" style="left: 0; width: 100%" />
                      <i v-for="(t, i) in barsOf(mv.r, c).times" :key="'b' + i" data-part="bar" :style="bar(t)" @pointerdown="startBar($event, mv.r, c, 'move')" />
                      <em v-for="(t, i) in barsOf(mv.r, c).breaks" :key="'k' + i" data-part="break" :style="bar(t)" />
                      <template v-if="editable && !cv(mv.r, c).locked && barsOf(mv.r, c).times.length">
                        <b data-part="handle" data-side="start" :title="L.resizeStart" :style="{ left: bar(barsOf(mv.r, c).times[0]!).left }" @pointerdown="startBar($event, mv.r, c, 'start')" />
                        <b
                          data-part="handle"
                          data-side="end"
                          :title="L.resizeEnd"
                          :style="{ left: `${pct(barsOf(mv.r, c).times[barsOf(mv.r, c).times.length - 1]!.end, chartRange)}%` }"
                          @pointerdown="startBar($event, mv.r, c, 'end')"
                        />
                      </template>
                    </span>
                    <span data-part="bar-label">{{ drag && barsOf(mv.r, c).state ? barsOf(mv.r, c).times.map(spanShort).join(" / ") : cv(mv.r, c).barLabel }}</span>
                  </span>
                  <span v-if="fillHere(mv.r, c)" data-part="fill-handle" aria-hidden="true" />
                  <ArIcon v-if="cv(mv.r, c).locked && show.locked" line name="lock" data-part="lock" aria-hidden="true" />
                </div>
              </div>
              <div v-if="show.count" data-part="foot" role="row">
                <div data-part="foot-name" role="rowheader">{{ L.count }}</div>
                <div v-for="dv in dayViews" :key="dv.d.date" data-part="foot-cell" role="gridcell" :data-today="dv.today ? '' : undefined">{{ fmt(L.countCell, { n: dv.count }) }}</div>
              </div>
              <div v-if="anyShortage" data-part="foot" data-tone="shortage" role="row">
                <div data-part="foot-name" role="rowheader">{{ L.shortage }}</div>
                <div
                  v-for="dv in dayViews"
                  :key="dv.d.date"
                  data-part="foot-cell"
                  role="gridcell"
                  :data-state="dv.shortage ? 'short' : 'ok'"
                  :data-tip="dv.shortTip || undefined"
                >
                  {{ dv.shortage ? fmt(L.shortageCell, { n: dv.shortage }) : L.none }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="$slots.footer || (show.hints && !compact)" data-part="hints">
          <slot name="footer" />
          <template v-if="show.hints && !compact && editable">
            <template v-if="mode === 'cell'">
              <b data-part="hint-title">{{ L.shortcutTitle }}</b>
              <span v-for="k in keys" :key="k.n" data-part="hint">
                <template v-if="hintForm === 'kbd'">{{ k.n }}<kbd data-part="kbd">{{ k.k }}</kbd></template>
                <template v-else>{{ k.n }}: {{ k.k }}</template>
              </span>
            </template>
            <template v-else>
              <ArIcon name="hand" size="sm" />
              <b data-part="hint-title">{{ L.chartTitle }}</b>
              <span v-for="h in L.chartHints" :key="h" data-part="hint">{{ h }}</span>
            </template>
            <span v-if="status" data-part="hint-status" aria-live="polite">{{ status }}</span>
          </template>
        </div>
      </div>
    </div>
    <ShiftGridTip ref="tip" :form="tipForm" />
    <ArHoverTip :root="root" />
    <ArFloat :id="`${uid}-menu`" :open="!!menu" :anchor="menu?.el ?? null" placement="right-start" ar="shift-grid-menu" role="menu" @close="menu = null">
      <div ref="menuPanel" data-part="menu" @keydown="onMenuKey">
        <button v-for="it in menuItems" :key="it.k" type="button" data-part="menu-item" role="menuitem" :data-item="it.k === 'open' ? (it.ic === 'pen' ? 'edit' : 'add') : it.k" :disabled="it.dis" @click="runMenu(it.k)">
          <ArIcon :name="it.ic" size="sm" />{{ it.n }}
        </button>
      </div>
    </ArFloat>
  </div>
</template>
