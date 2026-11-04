/**
 * ArShiftChart（シフトのチャート）の時間の計算。部品からも、テストからも使う（DOM を触らない）。
 * 時刻はすべて「その日の 0:00 からの分」。翌日の 3:00 は 1620。
 */

export interface ShiftChartSpan {
  start: number;
  end: number;
  id?: string | number;
}

/** 1人分の時間（シフトの時間帯と休憩）。ドラッグはこれを丸ごと作り直す。 */
export interface ShiftChartTimes {
  shifts: ShiftChartSpan[];
  breaks: ShiftChartSpan[];
}

/** ドラッグ・キーボードの操作の種類。 */
export type ShiftChartOp =
  | { kind: "move" | "start" | "end"; index: number }
  | { kind: "break-move" | "break-start" | "break-end"; index: number };

export const DAY = 1440;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** 分を間隔（15 など）の目盛りに丸める。 */
export const snap = (minutes: number, step: number) => (step > 0 ? Math.round(minutes / step) * step : Math.round(minutes));

/** 表示の範囲 [from, to) の中の位置（%）。範囲の外は端に寄せる。 */
export function pct(minutes: number, range: readonly [number, number]): number {
  const span = Math.max(1, range[1] - range[0]);
  return ((clamp(minutes, range[0], range[1]) - range[0]) / span) * 100;
}

/** 「09:00」。24 時より後は「27:00」のまま（ARROW の書き方）。 */
export function clock(minutes: number, pad = true): string {
  const m = Math.round(minutes);
  const h = Math.floor(m / 60);
  const mm = String(((m % 60) + 60) % 60).padStart(2, "0");
  return `${pad ? String(h).padStart(2, "0") : String(h)}:${mm}`;
}

/** 「31時間00分」。 */
export function duration(minutes: number, template = "{h}時間{mm}分"): string {
  const m = Math.max(0, Math.round(minutes));
  return template
    .replace("{h}", String(Math.floor(m / 60)))
    .replace("{mm}", String(m % 60).padStart(2, "0"))
    .replace("{m}", String(m % 60));
}

const copy = (s: ShiftChartSpan): ShiftChartSpan => ({ ...s });
export const copyTimes = (t: { shifts?: readonly ShiftChartSpan[]; breaks?: readonly ShiftChartSpan[] }): ShiftChartTimes => ({
  shifts: (t.shifts ?? []).map(copy).sort((a, b) => a.start - b.start),
  breaks: (t.breaks ?? []).map(copy).sort((a, b) => a.start - b.start),
});
export const sameTimes = (a: ShiftChartTimes, b: ShiftChartTimes) =>
  a.shifts.length === b.shifts.length &&
  a.breaks.length === b.breaks.length &&
  a.shifts.every((s, i) => s.start === b.shifts[i]!.start && s.end === b.shifts[i]!.end) &&
  a.breaks.every((s, i) => s.start === b.breaks[i]!.start && s.end === b.breaks[i]!.end);

const overlap = (a: ShiftChartSpan, b: ShiftChartSpan) => Math.max(0, Math.min(a.end, b.end) - Math.max(a.start, b.start));

/** 休憩が入っているシフト（いちばん重なるもの）。なければ undefined。 */
export function containerOf(shifts: readonly ShiftChartSpan[], brk: ShiftChartSpan): number | undefined {
  let best: number | undefined;
  let most = 0;
  shifts.forEach((s, i) => {
    const o = overlap(s, brk);
    if (o > most) {
      most = o;
      best = i;
    }
  });
  return best;
}

/** 休憩をシフトの中へ収める（はみ出した分は押して、入らなければ縮める）。 */
function fitInside(b: ShiftChartSpan, s: ShiftChartSpan): ShiftChartSpan {
  const len = Math.min(b.end - b.start, s.end - s.start);
  let start = b.start;
  if (start < s.start) start = s.start;
  if (start + len > s.end) start = s.end - len;
  return { ...b, start, end: start + len };
}

/**
 * ドラッグ（またはキーボード）で時間を変える。delta は動かした分（丸める前）。
 * 端は間隔の目盛りにそろえ（9:07 を動かすと 9:00 や 9:15 に乗る）、長さは間隔より短くしない。
 * シフトはとなりのシフトに重ならず、limit（既定 0:00〜翌12:00）を出ない。休憩はシフトの中で動く。
 */
export function applyOp(
  origin: ShiftChartTimes,
  op: ShiftChartOp,
  delta: number,
  step: number,
  limit: readonly [number, number] = [0, DAY * 1.5],
): ShiftChartTimes {
  const out = copyTimes(origin);
  const st = Math.max(1, step);
  if (op.kind === "move" || op.kind === "start" || op.kind === "end") {
    const s = out.shifts[op.index];
    if (!s) return out;
    const lo = op.index > 0 ? out.shifts[op.index - 1]!.end : limit[0];
    const hi = op.index < out.shifts.length - 1 ? out.shifts[op.index + 1]!.start : limit[1];
    const o = origin.shifts[op.index]!;
    const inside = origin.breaks.map((b) => containerOf(origin.shifts, b) === op.index);
    if (op.kind === "move") {
      const len = o.end - o.start;
      const start = clamp(snap(o.start + delta, st), lo, Math.max(lo, hi - len));
      const d = start - o.start;
      s.start = start;
      s.end = start + len;
      out.breaks = out.breaks.map((b, i) => (inside[i] ? { ...b, start: b.start + d, end: b.end + d } : b));
    } else if (op.kind === "start") {
      s.start = clamp(snap(o.start + delta, st), lo, o.end - st);
      out.breaks = out.breaks.map((b, i) => (inside[i] ? fitInside(b, s) : b));
    } else {
      s.end = clamp(snap(o.end + delta, st), o.start + st, hi);
      out.breaks = out.breaks.map((b, i) => (inside[i] ? fitInside(b, s) : b));
    }
    return out;
  }
  const b = out.breaks[op.index];
  const ob = origin.breaks[op.index];
  if (!b || !ob) return out;
  const ci = containerOf(origin.shifts, ob);
  const c = ci === undefined ? { start: limit[0], end: limit[1] } : origin.shifts[ci]!;
  const len = ob.end - ob.start;
  if (op.kind === "break-move") {
    b.start = clamp(snap(ob.start + delta, st), c.start, Math.max(c.start, c.end - len));
    b.end = b.start + len;
  } else if (op.kind === "break-start") {
    b.start = clamp(snap(ob.start + delta, st), c.start, ob.end - st);
  } else {
    b.end = clamp(snap(ob.end + delta, st), ob.start + st, c.end);
  }
  return out;
}

/** 空いた行のドラッグ：押したところ（anchor）から今の位置（at）まで。間隔より短くしない。 */
export function newSpan(anchor: number, at: number, step: number, limit: readonly [number, number] = [0, DAY * 1.5]): ShiftChartSpan {
  const st = Math.max(1, step);
  const a = clamp(snap(anchor, st), limit[0], limit[1] - st);
  const h = clamp(snap(at, st), limit[0], limit[1]);
  let start = Math.min(a, h);
  let end = Math.max(a, h);
  if (end - start < st) end = start + st;
  if (end > limit[1]) {
    end = limit[1];
    start = end - st;
  }
  return { start, end };
}

/** 表示の範囲を時間帯に合わせる：前後に1時間、まるい時刻、短くても minHours 時間。 */
export function fitRange(
  spans: readonly ShiftChartSpan[],
  fallback: readonly [number, number] = [8 * 60, 23 * 60],
  limit: readonly [number, number] = [0, DAY * 1.5],
  minHours = 6,
): [number, number] {
  if (!spans.length) return [fallback[0], fallback[1]];
  let from = Math.floor(Math.min(...spans.map((s) => s.start)) / 60) * 60 - 60;
  let to = Math.ceil(Math.max(...spans.map((s) => s.end)) / 60) * 60 + 60;
  from = Math.max(limit[0], from);
  to = Math.min(limit[1], to);
  if (to - from < minHours * 60) to = Math.min(limit[1], from + minHours * 60);
  if (to - from < minHours * 60) from = Math.max(limit[0], to - minHours * 60);
  return [from, to];
}

/** その時刻に働いている（シフトの中で、休憩の外）か。 */
export const workingAt = (t: ShiftChartTimes, at: number) =>
  t.shifts.some((s) => s.start <= at && at < s.end) && !t.breaks.some((b) => b.start <= at && at < b.end);

export interface ShiftChartNeedSpan {
  start: number;
  end: number;
  count: number;
}

/** その時刻の募集の人数（重なるときは多い方）。 */
export const needAt = (needs: readonly ShiftChartNeedSpan[], at: number) =>
  needs.reduce((n, x) => (x.start <= at && at < x.end ? Math.max(n, x.count) : n), 0);

export interface ShiftChartHour {
  start: number;
  /** その時間（真ん中の時刻）にシフトに入っている人数。 */
  count: number;
  /** 募集の人数（無ければ 0）。 */
  need: number;
  /** 足りない人数（募集 − 人数。足りていれば 0）。 */
  short: number;
}

/** 1時間ごとの人数・募集・不足。人数はその時間の真ん中の時刻で数える（休憩中の人は数えない）。 */
export function hourly(people: readonly ShiftChartTimes[], needs: readonly ShiftChartNeedSpan[], range: readonly [number, number]): ShiftChartHour[] {
  const out: ShiftChartHour[] = [];
  for (let h = range[0]; h < range[1]; h += 60) {
    const mid = h + 30;
    const count = people.filter((p) => workingAt(p, mid)).length;
    const need = needAt(needs, mid);
    out.push({ start: h, count, need, short: Math.max(0, need - count) });
  }
  return out;
}

/** 不足をまとめた時間帯（unit 分ごとに数え、同じ不足の人数が続くところをまとめる）。 */
export function shortSpans(
  people: readonly ShiftChartTimes[],
  needs: readonly ShiftChartNeedSpan[],
  range: readonly [number, number],
  unit = 15,
): ShiftChartNeedSpan[] {
  const out: ShiftChartNeedSpan[] = [];
  for (let t = range[0]; t < range[1]; t += unit) {
    const mid = t + unit / 2;
    const short = Math.max(0, needAt(needs, mid) - people.filter((p) => workingAt(p, mid)).length);
    const last = out[out.length - 1];
    if (short > 0 && last && last.end === t && last.count === short) last.end = t + unit;
    else if (short > 0) out.push({ start: t, end: t + unit, count: short });
  }
  return out;
}

/** 実働（シフト − 休憩）の分。 */
export const workMinutes = (t: ShiftChartTimes) =>
  t.shifts.reduce((n, s) => n + (s.end - s.start) - t.breaks.reduce((m, b) => m + overlap(s, b), 0), 0);

/** 目盛りの時刻（表示の範囲の中の、every 時間ごとの 0 分）。 */
export function ticks(range: readonly [number, number], every: number): number[] {
  const out: number[] = [];
  const first = Math.ceil(range[0] / 60) * 60;
  for (let m = first; m <= range[1]; m += every * 60) out.push(m);
  return out;
}
