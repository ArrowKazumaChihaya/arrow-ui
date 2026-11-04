<script setup lang="ts">
/**
 * ArShiftChart 1.0 — シフトのチャート。1行＝1人のバー（パターンの色・休憩は白い斜線）を、表示する時間の上に並べる。
 * バーのドラッグで移動・両端で伸び縮み・休憩の移動と伸び縮み（ドラッグの間隔できざむ）、空いた行のドラッグで追加、提出（緑の点線の枠）からの追加。
 * 下に1時間ごとの人数・募集・不足の行。上に表示する時間・シフトに合わせる・ドラッグの間隔・印刷。読み取り専用・スマホ・印刷用の形を持つ。
 * データは製品の形（0:00 からの分）で受け取り、変えた結果はイベントで返す（保存は製品）。
 */
import { computed, ref, shallowRef } from "vue";
import ArButton from "./ArButton.vue";
import ArIcon from "./ArIcon.vue";
import ArSelect from "./ArSelect.vue";
import ArSwitch from "./ArSwitch.vue";
import { arAvatarToneOf } from "./avatar";
import { useDesignForm, useId } from "../provider/context";
import {
  applyOp,
  clock,
  copyTimes,
  fitRange,
  hourly,
  newSpan,
  pct,
  sameTimes,
  shortSpans,
  workMinutes,
  type ShiftChartOp,
  type ShiftChartTimes,
} from "../internal/shiftChartTime";
import { useShiftChartDrag, type ShiftChartDragState } from "../internal/shiftChartDrag";
import type {
  ArShiftChartChange,
  ArShiftChartLabels,
  ArShiftChartNeed,
  ArShiftChartProps,
  ArShiftChartRow,
  ArShiftChartSpan,
} from "./ArShiftChart.contract";

const props = withDefaults(defineProps<ArShiftChartProps>(), {
  range: undefined,
  step: undefined,
  stepOptions: () => [5, 10, 15, 30],
  limit: () => [0, 2160],
  needs: () => [],
  shortages: undefined,
  readonly: false,
  locked: false,
  variant: "board",
  toolbar: undefined,
  printable: true,
  countRow: true,
  shortRow: true,
  legend: true,
  summary: true,
  others: undefined,
  othersToggle: false,
  hint: undefined,
  title: undefined,
  subtitle: undefined,
  emptyText: undefined,
  label: undefined,
  labels: () => ({}),
});
const emit = defineEmits<{
  "update:range": [range: [number, number]];
  "update:step": [step: number];
  "update:others": [value: boolean];
  change: [payload: ArShiftChartChange];
  add: [payload: { row: ArShiftChartRow; span: ArShiftChartSpan }];
  take: [payload: { row: ArShiftChartRow; span: ArShiftChartSpan; available: ArShiftChartSpan }];
  print: [];
}>();
defineSlots<{
  actions?(): unknown;
  options?(): unknown;
  name?(p: { row: ArShiftChartRow }): unknown;
}>();

const DEFAULT_LABELS: ArShiftChartLabels = {
  range: "表示する時間",
  rangeFrom: "表示の開始",
  rangeTo: "表示の終了",
  fit: "シフトに合わせる",
  step: "ドラッグの間隔",
  stepMinutes: "{m}分",
  print: "印刷",
  hour: "{h}時",
  nextHour: "翌{h}時",
  name: "名前",
  count: "人数",
  countSub: "上：シフト　下：募集",
  need: "必要人数",
  short: "不足人数",
  people: "{n}人",
  hourTip: "{h}時台　シフト {n}人／募集 {need}人",
  shortTip: "（{n}人不足）",
  legendShift: "シフト",
  legendBreak: "休憩",
  legendPunch: "勤怠（打刻）",
  legendAvailable: "提出（押すとシフトに）",
  legendOther: "ほかの店舗・部署",
  legendShort: "募集より少ない",
  hint: "バーをドラッグで移動・両端で伸び縮み。休憩も動かせます。空いている行はドラッグで新しく追加",
  hintLocked: "ロック中のため動かせません",
  readonlyHint: "",
  shortTime: "募集より少ない時間 {t}",
  enough: "募集人数を満たしています",
  members: "出勤",
  membersUnit: "{n}名",
  total: "シフト合計",
  countSummary: "当店舗のシフト人数 {n}人",
  duration: "{h}時間{mm}分",
  durationHours: "{h}時間",
  noShift: "シフトなし",
  availableSub: "提出あり",
  available: "提出 {t}",
  availableTip: "押すと {t} でシフトに入れます",
  addRow: "{name}にシフトを追加",
  addTip: "ドラッグして新しくシフトを入れる",
  breakLabel: "休憩 {t}",
  startHandle: "開始時刻を変える",
  endHandle: "終了時刻を変える",
  otherTip: "{label}での勤務　{t}",
  othersOn: "他店舗シフトも表示",
  othersOff: "当店舗シフトのみを表示",
  punch: "勤怠（打刻） {t}",
  working: "勤務中",
  keys: "← → で移動、Shift と ← → で終わり、Alt と ← → で始まりを変えます。Enter で決定、Escape で戻します。",
  changed: "{name} {t}",
  bar: "シフトのバー",
  empty: "データがありません",
};
const L = computed<ArShiftChartLabels>(() => ({ ...DEFAULT_LABELS, ...props.labels }));
const fill = (s: string, v: Record<string, string | number>) => Object.entries(v).reduce((t, [k, x]) => t.split(`{${k}}`).join(String(x)), s);

const countsForm = useDesignForm<"hourly" | "spans">("ArShiftChart", "counts", "hourly");
const barForm = useDesignForm<"time" | "icon">("ArShiftChart", "bar", "time");
const avatarForm = useDesignForm<"initial" | "balloon">("ArShiftChart", "avatar", "initial");
const axisForm = useDesignForm<"hour" | "number">("ArShiftChart", "axis", "hour");
const summaryForm = useDesignForm<"status" | "count">("ArShiftChart", "summary", "status");
const legendForm = useDesignForm<"always" | "editing">("ArShiftChart", "legend", "always");

const uid = useId("ar-shift-chart");
const isPrint = computed(() => props.variant === "print");
const lockedOn = computed(() => props.locked !== false && props.locked !== undefined);
/** ドラッグ・追加ができるか（行ごとの editable は別）。 */
const interactive = computed(() => !props.readonly && !isPrint.value && !lockedOn.value);
const showToolbar = computed(() => !isPrint.value && (props.toolbar ?? !props.readonly));

// ---- 間隔・ほかの店舗 -----------------------------------------------------------------
const innerStep = ref(15);
const stepValue = computed(() => props.step ?? innerStep.value);
function setStep(v: unknown) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return;
  innerStep.value = n;
  emit("update:step", n);
}
const innerOthers = ref(true);
const othersOn = computed(() => props.others ?? innerOthers.value);
function setOthers(v: boolean) {
  innerOthers.value = v;
  emit("update:others", v);
}

// ---- 表示する時間 -----------------------------------------------------------------------
const innerRange = shallowRef<[number, number] | null>(null);
const allSpans = computed(() =>
  props.rows.flatMap((r) => [...(r.shifts ?? []), ...(othersOn.value ? (r.others ?? []) : []), ...(r.shifts?.length ? [] : (r.available ?? []))]),
);
const fitted = computed(() => fitRange(allSpans.value, [8 * 60, 23 * 60], props.limit));
const range = computed<[number, number]>(() => {
  const r = props.range ?? innerRange.value ?? fitted.value;
  return [r[0], Math.max(r[0] + 60, r[1])];
});
function setRange(r: [number, number]) {
  innerRange.value = r;
  emit("update:range", r);
}
function fit() {
  setRange(fitted.value);
}
const hourText = (m: number, form = axisForm.value) => {
  const h = Math.floor(m / 60);
  if (form === "number") return String(h);
  return h >= 24 ? fill(L.value.nextHour, { h: h - 24 }) : fill(L.value.hour, { h });
};
const fromOptions = computed(() => {
  const out: { value: number; label: string }[] = [];
  for (let m = Math.ceil(props.limit[0] / 60) * 60; m < props.limit[1]; m += 60) out.push({ value: m, label: hourText(m, "hour") });
  return out;
});
const toOptions = computed(() => {
  const out: { value: number; label: string }[] = [];
  for (let m = range.value[0] + 60; m <= props.limit[1]; m += 60) out.push({ value: m, label: hourText(m, "hour") });
  return out;
});
const stepSelectOptions = computed(() => props.stepOptions.map((m) => ({ value: m, label: fill(L.value.stepMinutes, { m }) })));
function setFrom(v: unknown) {
  const n = Number(v);
  if (!Number.isFinite(n)) return;
  setRange([n, Math.max(n + 60, range.value[1])]);
}
function setTo(v: unknown) {
  const n = Number(v);
  if (!Number.isFinite(n)) return;
  setRange([Math.min(range.value[0], n - 60), n]);
}
const hours = computed(() => {
  const out: number[] = [];
  for (let m = range.value[0]; m < range.value[1]; m += 60) out.push(m);
  return out;
});
const ticks = computed(() => {
  if (axisForm.value === "number") return hours.value.map((m) => ({ m, left: pct(m, range.value), width: pct(m + 60, range.value) - pct(m, range.value), text: hourText(m) }));
  const every = hours.value.length > 14 ? 2 : 1;
  return hours.value
    .filter((m, i) => i > 0 && i % every === 0)
    .map((m) => ({ m, left: pct(m, range.value), width: 0, text: hourText(m) }));
});
const P = (m: number) => pct(m, range.value);
const place = (s: { start: number; end: number }) => ({ left: `${P(s.start)}%`, width: `${Math.max(0, P(s.end) - P(s.start))}%` });
const visible = (s: { start: number; end: number }) => s.end > range.value[0] && s.start < range.value[1];
const gridVars = computed(() => ({ "--ar-shift-chart-hour": `${100 / Math.max(1, hours.value.length)}%` }));

// ---- ドラッグとキーボード ----------------------------------------------------------------
const drag = useShiftChartDrag({
  range: () => range.value,
  step: () => stepValue.value,
  limit: () => props.limit,
  onEnd: endDrag,
});
interface KeyState {
  key: string | number;
  op: ShiftChartOp;
  origin: ShiftChartTimes;
  current: ShiftChartTimes;
}
const kb = shallowRef<KeyState | null>(null);
const live = ref("");

const rowByKey = (k: string | number) => props.rows.find((r) => r.key === k);
const timesOf = (r: ArShiftChartRow): ShiftChartTimes => copyTimes(r);
/** 今の時間（ドラッグ中・キーボードで動かし中ならそちら）。 */
function nowTimes(r: ArShiftChartRow): ShiftChartTimes {
  const d = drag.state.value;
  if (d && d.key === r.key && d.kind === "op") return d.current;
  if (kb.value && kb.value.key === r.key) return kb.value.current;
  return timesOf(r);
}
const rowEditable = (r: ArShiftChartRow) => interactive.value && r.editable !== false;
const canAdd = (r: ArShiftChartRow) => rowEditable(r) && !(r.shifts?.length ?? 0) && !r.leave;

function freezeRange() {
  if (props.range === undefined && innerRange.value === null) innerRange.value = range.value;
}
function trackOf(e: Event) {
  return (e.currentTarget as HTMLElement).closest('[data-part="track"]') as HTMLElement;
}
function downOp(e: PointerEvent, r: ArShiftChartRow, op: ShiftChartOp) {
  if (!rowEditable(r)) return;
  commitKeys();
  freezeRange();
  drag.begin(e, trackOf(e), { key: r.key, kind: "op", op, origin: timesOf(r) });
}
function downTrack(e: PointerEvent, r: ArShiftChartRow) {
  if (!canAdd(r)) return;
  if (e.pointerType === "touch") return; // 指は横にすべらせる。追加は Enter かマウス・ペンで
  freezeRange();
  drag.begin(e, e.currentTarget as HTMLElement, { key: r.key, kind: "new", origin: timesOf(r) });
}
function downFrame(e: PointerEvent, r: ArShiftChartRow, a: ArShiftChartSpan) {
  if (!canAdd(r)) return;
  freezeRange();
  drag.begin(e, trackOf(e), { key: r.key, kind: "take", origin: timesOf(r), frame: a });
}
const ACTION: Record<ShiftChartOp["kind"], [ArShiftChartChange["part"], ArShiftChartChange["action"]]> = {
  move: ["shift", "move"],
  start: ["shift", "start"],
  end: ["shift", "end"],
  "break-move": ["break", "move"],
  "break-start": ["break", "start"],
  "break-end": ["break", "end"],
};
function emitChange(r: ArShiftChartRow, op: ShiftChartOp, t: ShiftChartTimes, keyboard: boolean) {
  const [part, action] = ACTION[op.kind];
  emit("change", { row: r, shifts: t.shifts.map((s) => ({ ...s })), breaks: t.breaks.map((s) => ({ ...s })), part, action, index: op.index, keyboard });
  live.value = fill(L.value.changed, { name: r.name, t: spanText(t.shifts, false) });
}
function endDrag(s: ShiftChartDragState) {
  const r = rowByKey(s.key);
  if (!r) return;
  if (s.kind === "op") {
    if (s.moved && s.op && !sameTimes(s.origin, s.current)) emitChange(r, s.op, s.current, false);
  } else if (s.kind === "new") {
    if (s.moved && s.draft) emit("add", { row: r, span: { ...s.draft } });
  } else if (s.frame) {
    emit("take", { row: r, span: s.moved && s.draft ? { ...s.draft } : { start: s.frame.start, end: s.frame.end }, available: s.frame });
  }
}
function commitKeys() {
  const k = kb.value;
  kb.value = null;
  if (!k || sameTimes(k.origin, k.current)) return;
  const r = rowByKey(k.key);
  if (r) emitChange(r, k.op, k.current, true);
}
function keyOp(e: KeyboardEvent, r: ArShiftChartRow, part: "shift" | "break", index: number) {
  if (!rowEditable(r)) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    commitKeys();
    return;
  }
  if (e.key === "Escape") {
    if (kb.value) {
      e.preventDefault();
      e.stopPropagation();
      const k = kb.value;
      kb.value = null;
      const rr = rowByKey(k.key);
      if (rr) live.value = fill(L.value.changed, { name: rr.name, t: spanText(k.origin.shifts, false) });
    }
    return;
  }
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  e.preventDefault();
  const dir = e.key === "ArrowLeft" ? -1 : 1;
  const kind = (part === "shift" ? (e.shiftKey ? "end" : e.altKey ? "start" : "move") : e.shiftKey ? "break-end" : e.altKey ? "break-start" : "break-move") as ShiftChartOp["kind"];
  const op = { kind, index } as ShiftChartOp;
  if (kb.value && kb.value.key !== r.key) commitKeys();
  freezeRange();
  const base = kb.value ?? { key: r.key, op, origin: timesOf(r), current: timesOf(r) };
  const current = applyOp(base.current, op, dir * stepValue.value, stepValue.value, props.limit);
  kb.value = { ...base, op, current };
  live.value = fill(L.value.changed, {
    name: r.name,
    t: part === "shift" ? spanText(current.shifts, false) : fill(L.value.breakLabel, { t: spanText([current.breaks[index]!], false) }),
  });
}
function focusOut(e: FocusEvent) {
  const to = e.relatedTarget as HTMLElement | null;
  if (to && to.closest?.('[data-part="track"]') === (e.currentTarget as HTMLElement)) return;
  commitKeys();
}
function defaultSpan(r: ArShiftChartRow): ArShiftChartSpan {
  const a = r.available?.[0];
  if (a) return { start: a.start, end: a.end };
  return newSpan(Math.max(range.value[0], Math.min(9 * 60, range.value[1] - 60)), Math.min(range.value[1], Math.max(range.value[0], 9 * 60) + 8 * 60), stepValue.value, props.limit);
}
function keyTrack(e: KeyboardEvent, r: ArShiftChartRow) {
  if (e.target !== e.currentTarget || !canAdd(r)) return;
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  emit("add", { row: r, span: defaultSpan(r) });
}
function keyFrame(e: KeyboardEvent, r: ArShiftChartRow, a: ArShiftChartSpan) {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  e.stopPropagation();
  if (canAdd(r)) emit("take", { row: r, span: { start: a.start, end: a.end }, available: a });
}

// ---- 行 ---------------------------------------------------------------------------------
function spanText(spans: readonly { start: number; end: number }[], pad = true, sep = "〜") {
  return spans.map((s) => `${clock(s.start, pad)}${sep}${clock(s.end, pad)}`).join(" / ");
}
const workText = (t: ShiftChartTimes) => {
  const m = workMinutes(t);
  return fill(L.value.duration, { h: Math.floor(m / 60), mm: String(m % 60).padStart(2, "0"), m: m % 60 });
};
const shown = computed(() =>
  props.rows.filter((r) => othersOn.value || (r.shifts?.length ?? 0) > 0 || !!r.leave || (r.available?.length ?? 0) > 0 || !(r.others?.length ?? 0)),
);
const view = computed(() =>
  shown.value.map((r) => {
    const t = nowTimes(r);
    const d = drag.state.value;
    const dragging = (d && d.key === r.key && d.moved) || (kb.value && kb.value.key === r.key);
    const editable = rowEditable(r);
    const add = canAdd(r);
    const draft = d && d.key === r.key && d.kind !== "op" && d.moved ? d.draft : undefined;
    const sub =
      r.sub ??
      (t.shifts.length
        ? spanText(t.shifts)
        : r.leave
          ? r.leave
          : r.available?.length
            ? L.value.availableSub
            : r.others?.length
              ? r.others[0]!.label
              : L.value.noShift);
    const name = Array.from(r.name.trim())[0] ?? "";
    return {
      r,
      t,
      sub,
      initial: name,
      tone: arAvatarToneOf(r.seed ?? (typeof r.key === "number" ? r.key : String(r.key))),
      editable,
      add,
      dragging: !!dragging,
      draft,
      bars: t.shifts.map((s, i) => ({
        i,
        s,
        style: { ...place(s), "--ar-shift-chart-bar": r.color ?? undefined },
        text: `${clock(s.start)}–${clock(s.end)}`,
        tip: [`${r.name}　${clock(s.start)}〜${clock(s.end)}　実働${workText({ shifts: [s], breaks: t.breaks })}`, r.pattern].filter(Boolean).join("\n"),
        aria: `${r.name} ${clock(s.start, false)}〜${clock(s.end, false)}${r.pattern ? `（${r.pattern}）` : ""}`,
        startLeft: `${P(s.start)}%`,
        endLeft: `${P(s.end)}%`,
        visible: visible(s),
      })),
      breaks: t.breaks.map((b, i) => ({
        i,
        b,
        style: place(b),
        text: fill(L.value.breakLabel, { t: `${clock(b.start)}〜${clock(b.end)}` }),
        aria: `${r.name} ${fill(L.value.breakLabel, { t: `${clock(b.start, false)}〜${clock(b.end, false)}` })}`,
        visible: visible(b),
      })),
      available: (r.available ?? []).filter(visible).map((a) => ({
        a,
        style: place(a),
        text: fill(L.value.available, { t: `${clock(a.start)}–${clock(a.end)}` }),
        tip: [fill(L.value.availableTip, { t: `${clock(a.start)}〜${clock(a.end)}` }), r.availableNote].filter(Boolean).join("　"),
      })),
      others: othersOn.value
        ? (r.others ?? []).filter(visible).map((o) => ({
            o,
            style: place(o),
            text: `${o.label}　${clock(o.start, false)}–${clock(o.end, false)}`,
            tip: fill(L.value.otherTip, { label: o.label, t: `${clock(o.start)} 〜 ${clock(o.end)}` }),
          }))
        : [],
      punches: (r.punches ?? []).filter(visible).map((p, i, a) => ({
        style: place(p),
        open: !!r.punchOpen && i === a.length - 1,
        tip: fill(L.value.punch, { t: `${clock(p.start)}〜${r.punchOpen && i === a.length - 1 ? L.value.working : clock(p.end)}` }),
      })),
      aria: [r.name, t.shifts.length ? spanText(t.shifts, false) : sub].join(" "),
    };
  }),
);

// ---- 人数・募集・不足 --------------------------------------------------------------------
const members = computed(() =>
  props.rows.filter((r) => (r.shifts?.length ?? 0) > 0).map((r) => nowTimes(r)),
);
const hasNeeds = computed(() => props.needs.length > 0 || (props.shortages?.length ?? 0) > 0);
const perHour = computed(() => hourly(members.value, props.needs, range.value));
const hourCells = computed(() =>
  perHour.value.map((h) => {
    const short = props.shortages ? props.shortages.reduce((n, s) => (s.start <= h.start + 30 && h.start + 30 < s.end ? Math.max(n, s.count) : n), 0) : h.short;
    return {
      ...h,
      short,
      style: { left: `calc(${P(h.start)}% + 2px)`, width: `calc(${100 / hours.value.length}% - 4px)` },
      plainStyle: place({ start: h.start, end: h.start + 60 }),
      tip: fill(L.value.hourTip, { h: Math.floor(h.start / 60), n: h.count, need: h.need }) + (short ? fill(L.value.shortTip, { n: short }) : ""),
    };
  }),
);
const shortList = computed<ArShiftChartNeed[]>(() => props.shortages ? [...props.shortages] : shortSpans(members.value, props.needs, range.value, 15));
const shortMinutes = computed(() =>
  shortList.value.reduce((n, s) => n + Math.max(0, Math.min(s.end, range.value[1]) - Math.max(s.start, range.value[0])), 0),
);
const hasShort = computed(() => hasNeeds.value && shortList.value.some(visible));
const spanCells = (list: readonly ArShiftChartNeed[]) =>
  list.filter(visible).map((s, i, a) => ({
    s,
    style: place(s),
    join: i > 0 && a[i - 1]!.end === s.start,
    text: s.end - s.start >= 60 && s.count ? fill(L.value.people, { n: s.count }) : "",
  }));
const needSpans = computed(() => spanCells(props.needs));
const shortSpanCells = computed(() => spanCells(shortList.value));

// ---- 凡例・まとめ -----------------------------------------------------------------------
const anyPunch = computed(() => props.rows.some((r) => r.punches?.length));
const anyAvailable = computed(() => props.rows.some((r) => r.available?.length && !(r.shifts?.length ?? 0)));
const anyOther = computed(() => othersOn.value && props.rows.some((r) => r.others?.length));
const showLegendItems = computed(() => props.legend && (legendForm.value === "always" || (!props.readonly && !isPrint.value)));
const hintText = computed(() => {
  if (props.hint !== undefined) return props.hint;
  if (isPrint.value) return "";
  if (lockedOn.value) return typeof props.locked === "string" ? props.locked : L.value.hintLocked;
  if (props.readonly) return L.value.readonlyHint;
  return L.value.hint;
});
const totalMinutes = computed(() => members.value.reduce((n, t) => n + workMinutes(t), 0));
const summaryTone = computed(() => (!props.needs.length && !props.shortages ? "neutral" : shortMinutes.value ? "danger" : "ok"));
const summaryText = computed(() => {
  if (summaryTone.value === "neutral") return "";
  if (summaryTone.value === "ok") return L.value.enough;
  const m = shortMinutes.value;
  const t = m % 60 ? fill(L.value.duration, { h: Math.floor(m / 60), mm: String(m % 60).padStart(2, "0"), m: m % 60 }) : fill(L.value.durationHours, { h: m / 60 });
  return fill(L.value.shortTime, { t });
});
const thisBranchCount = computed(() => members.value.length);
const isEmpty = computed(() => !props.rows.length && !hasNeeds.value);
const keysId = `${uid}-keys`;
</script>

<template>
  <div
    data-ar="shift-chart"
    data-part="root"
    :data-variant="variant"
    :data-counts="countsForm"
    :data-bar="barForm"
    :data-avatar="avatarForm"
    :data-axis="axisForm"
    :data-state="[readonly && 'readonly', lockedOn && 'locked', drag.state.value?.moved && 'dragging'].filter(Boolean).join(' ') || undefined"
    role="group"
    :aria-label="label ?? title"
  >
    <div v-if="isPrint && (title || subtitle)" data-part="print-head">
      <b>{{ title }}</b>
      <span v-if="subtitle">{{ subtitle }}</span>
    </div>
    <div v-if="othersToggle && !isPrint" data-part="toggle">
      <ArSwitch :model-value="othersOn" tone="accent" :label="L.othersOn" @update:model-value="setOthers(!!$event)">{{ othersOn ? L.othersOn : L.othersOff }}</ArSwitch>
    </div>
    <div v-if="showToolbar" data-part="toolbar">
      <span data-part="toolbar-label">{{ L.range }}</span>
      <ArSelect :model-value="range[0]" :options="fromOptions" size="sm" :label="L.rangeFrom" :list-height="240" @update:model-value="setFrom" />
      <span aria-hidden="true">〜</span>
      <ArSelect :model-value="range[1]" :options="toOptions" size="sm" :label="L.rangeTo" :list-height="240" @update:model-value="setTo" />
      <ArButton tone="secondary" size="sm" @click="fit">{{ L.fit }}</ArButton>
      <template v-if="!readonly">
        <span data-part="toolbar-sep" aria-hidden="true" />
        <span data-part="toolbar-label">{{ L.step }}</span>
        <ArSelect :model-value="stepValue" :options="stepSelectOptions" size="sm" :label="L.step" @update:model-value="setStep" />
      </template>
      <span data-part="toolbar-space" aria-hidden="true" />
      <ArButton v-if="printable" tone="secondary" size="sm" icon="print" @click="emit('print')">{{ L.print }}</ArButton>
    </div>
    <div v-if="$slots.actions" data-part="actions"><slot name="actions" /></div>

    <div v-if="!isEmpty" data-part="grid" :style="gridVars">
      <div v-if="axisForm === 'hour'" data-part="head" aria-hidden="true">
        <div data-part="head-name">{{ L.name }}</div>
        <div data-part="axis">
          <span v-for="t in ticks" :key="t.m" data-part="tick" :style="{ left: `${t.left}%` }">{{ t.text }}</span>
        </div>
      </div>

      <div v-for="v in view" :key="v.r.key" data-part="row" role="group" :aria-label="v.aria" :data-state="[v.dragging && 'drag', !v.editable && interactive && 'locked'].filter(Boolean).join(' ') || undefined">
        <div data-part="name">
          <slot name="name" :row="v.r">
            <span data-part="avatar" :data-tone="v.tone" aria-hidden="true">
              <img v-if="v.r.image" :src="v.r.image" alt="" />
              <ArIcon v-else-if="avatarForm === 'balloon'" name="user" />
              <template v-else>{{ v.initial }}</template>
            </span>
            <span data-part="name-text">
              <b data-part="name-main">{{ v.r.name }}</b>
              <small data-part="name-sub">{{ v.sub }}</small>
            </span>
          </slot>
        </div>
        <div
          data-part="track"
          :data-state="[v.add && 'add', v.dragging && 'drag', !v.editable && interactive && 'locked'].filter(Boolean).join(' ') || undefined"
          :tabindex="v.add ? 0 : undefined"
          :role="v.add ? 'button' : undefined"
          :aria-label="v.add ? L.addRow.replace('{name}', v.r.name) : undefined"
          :title="v.add ? L.addTip : undefined"
          @pointerdown="downTrack($event, v.r)"
          @keydown="keyTrack($event, v.r)"
          @focusout="focusOut"
        >
          <span v-if="v.r.leave" data-part="leave">{{ v.r.leave }}</span>
          <span v-for="(o, i) in v.others" :key="`o${i}`" data-part="other" :style="o.style" :title="o.tip">{{ o.text }}</span>
          <span
            v-for="(a, i) in v.available"
            :key="`a${i}`"
            data-part="available"
            :data-state="v.add ? 'on' : undefined"
            :style="a.style"
            :title="a.tip"
            :tabindex="v.add ? 0 : undefined"
            :role="v.add ? 'button' : undefined"
            :aria-label="v.add ? `${v.r.name} ${a.tip}` : undefined"
            @pointerdown.stop="downFrame($event, v.r, a.a)"
            @keydown="keyFrame($event, v.r, a.a)"
          ><ArIcon name="plus" /><span>{{ a.text }}</span></span>
          <template v-for="b in v.bars" :key="`b${b.i}`">
            <span
              v-if="b.visible"
              data-part="bar"
              :data-state="[!v.r.color && 'plain', v.editable && 'editable'].filter(Boolean).join(' ') || undefined"
              :style="b.style"
              :title="drag.state.value ? undefined : b.tip"
              :tabindex="v.editable ? 0 : undefined"
              :role="v.editable ? 'button' : 'img'"
              :aria-label="b.aria"
              :aria-roledescription="L.bar"
              :aria-describedby="v.editable ? keysId : undefined"
              @pointerdown="downOp($event, v.r, { kind: 'move', index: b.i })"
              @keydown="keyOp($event, v.r, 'shift', b.i)"
            >
              <span v-if="barForm === 'time'" data-part="bar-text">{{ b.text }}</span>
              <ArIcon v-else name="user" data-part="bar-icon" />
            </span>
          </template>
          <template v-for="k in v.breaks" :key="`k${k.i}`">
            <span
              v-if="k.visible"
              data-part="break"
              :style="k.style"
              :title="drag.state.value ? undefined : k.text"
              :tabindex="v.editable ? 0 : undefined"
              :role="v.editable ? 'button' : 'img'"
              :aria-label="k.aria"
              :aria-describedby="v.editable ? keysId : undefined"
              @pointerdown="downOp($event, v.r, { kind: 'break-move', index: k.i })"
              @keydown="keyOp($event, v.r, 'break', k.i)"
            >
              <template v-if="v.editable">
                <i data-part="break-handle" data-side="start" @pointerdown="downOp($event, v.r, { kind: 'break-start', index: k.i })" />
                <i data-part="break-handle" data-side="end" @pointerdown="downOp($event, v.r, { kind: 'break-end', index: k.i })" />
              </template>
            </span>
          </template>
          <template v-if="v.editable">
            <template v-for="b in v.bars" :key="`h${b.i}`">
              <span v-if="b.visible" data-part="handle" data-side="start" :style="{ left: b.startLeft }" :title="L.startHandle" aria-hidden="true" @pointerdown="downOp($event, v.r, { kind: 'start', index: b.i })"><i /></span>
              <span v-if="b.visible" data-part="handle" data-side="end" :style="{ left: b.endLeft }" :title="L.endHandle" aria-hidden="true" @pointerdown="downOp($event, v.r, { kind: 'end', index: b.i })"><i /></span>
            </template>
          </template>
          <span v-if="v.draft" data-part="draft" :style="place(v.draft)" aria-hidden="true"><span data-part="bar-text">{{ clock(v.draft.start) }}–{{ clock(v.draft.end) }}</span></span>
          <span v-for="(p, i) in v.punches" :key="`p${i}`" data-part="punch" :data-state="p.open ? 'open' : undefined" :style="p.style" :title="p.tip" />
        </div>
      </div>

      <template v-if="countsForm === 'hourly'">
        <div v-if="countRow" data-part="counts" data-kind="count">
          <div data-part="count-name">{{ L.count }}<small v-if="needs.length">{{ L.countSub }}</small></div>
          <div data-part="count-track">
            <span v-for="c in hourCells" :key="c.start" data-part="cell" :data-tone="c.short ? 'short' : 'ok'" :style="c.style" :title="c.tip" :aria-label="c.tip">
              <b>{{ c.count }}</b><i v-if="needs.length">{{ c.need || "—" }}</i>
            </span>
          </div>
        </div>
        <div v-if="shortRow && hasShort" data-part="counts" data-kind="short">
          <div data-part="count-name">{{ L.short }}</div>
          <div data-part="count-track">
            <template v-for="c in hourCells" :key="c.start">
              <span v-if="c.short" data-part="cell" data-tone="short" :style="c.style" :title="c.tip">{{ L.people.replace("{n}", String(c.short)) }}</span>
            </template>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="countRow" data-part="counts" data-kind="count">
          <div data-part="count-name">{{ L.count }}</div>
          <div data-part="count-track">
            <span v-for="c in hourCells" :key="c.start" data-part="cell" :style="c.plainStyle" :title="c.tip">{{ c.count }}</span>
          </div>
        </div>
        <div v-if="needs.length" data-part="counts" data-kind="need">
          <div data-part="count-name">{{ L.need }}</div>
          <div data-part="count-track">
            <span v-for="(c, i) in needSpans" :key="i" data-part="span" :data-join="c.join || undefined" :style="c.style" :title="`${clock(c.s.start)}〜${clock(c.s.end)} ${L.people.replace('{n}', String(c.s.count))}`"><span>{{ c.text }}</span></span>
          </div>
        </div>
        <div v-if="shortRow && hasShort" data-part="counts" data-kind="short">
          <div data-part="count-name">{{ L.short }}</div>
          <div data-part="count-track">
            <span v-for="(c, i) in shortSpanCells" :key="i" data-part="span" :data-join="c.join || undefined" :style="c.style" :title="`${clock(c.s.start)}〜${clock(c.s.end)} ${L.people.replace('{n}', String(c.s.count))}`"><span>{{ c.text }}</span></span>
          </div>
        </div>
      </template>

      <div v-if="axisForm === 'number'" data-part="foot-axis" aria-hidden="true">
        <div data-part="head-name" />
        <div data-part="axis">
          <span v-for="t in ticks" :key="t.m" data-part="tick" :style="{ left: `${t.left}%`, width: `${t.width}%` }"><b>{{ t.text }}</b></span>
        </div>
      </div>
    </div>
    <p v-else data-part="empty">{{ emptyText ?? L.empty }}</p>

    <div v-if="showLegendItems || hintText || $slots.options" data-part="legend">
      <slot name="options" />
      <template v-if="showLegendItems">
        <span data-part="legend-item"><i data-part="swatch" data-kind="shift" />{{ L.legendShift }}</span>
        <span data-part="legend-item"><i data-part="swatch" data-kind="break" />{{ L.legendBreak }}</span>
        <span v-if="anyPunch" data-part="legend-item"><i data-part="swatch" data-kind="punch" />{{ L.legendPunch }}</span>
        <span v-if="anyAvailable" data-part="legend-item"><i data-part="swatch" data-kind="available" />{{ L.legendAvailable }}</span>
        <span v-if="anyOther" data-part="legend-item"><i data-part="swatch" data-kind="other" />{{ L.legendOther }}</span>
        <span v-if="hasShort" data-part="legend-item"><i data-part="swatch" data-kind="short" />{{ L.legendShort }}</span>
      </template>
      <span v-if="hintText" data-part="hint"><ArIcon :name="lockedOn ? 'lock' : 'hand'" />{{ hintText }}</span>
    </div>

    <div v-if="summary && !isEmpty" data-part="summary" :data-tone="summaryForm === 'status' ? summaryTone : undefined">
      <template v-if="summaryForm === 'status'">
        <span v-if="summaryText" data-part="summary-status"><ArIcon :name="summaryTone === 'danger' ? 'alert' : 'check'" />{{ summaryText }}</span>
        <span data-part="summary-total">
          {{ L.members }} <b>{{ L.membersUnit.replace("{n}", String(members.length)) }}</b>　{{ L.total }} <b>{{ fill(L.duration, { h: Math.floor(totalMinutes / 60), mm: String(totalMinutes % 60).padStart(2, "0"), m: totalMinutes % 60 }) }}</b>
        </span>
      </template>
      <span v-else data-part="summary-total">{{ L.countSummary.replace("{n}", String(thisBranchCount)) }}</span>
    </div>

    <span :id="keysId" data-ar-visually-hidden>{{ L.keys }}</span>
    <span data-part="live" data-ar-visually-hidden aria-live="polite">{{ live }}</span>
  </div>
</template>
