/**
 * ArShiftGrid の計算（時刻の書き方・チャートの位置・ドラッグのきざみ・範囲）。
 * F3 専用。ArShiftChart（日の詳細のチャート）とは別に持つ。
 */
import type { ArShiftGridCell, ArShiftGridTime } from "../components/ArShiftGrid.contract";

const pad = (n: number) => String(n).padStart(2, "0");

/** 09:00（今の ARROW の time() と同じ。前日は「前日」を付ける）。 */
export function clock(m: number, prevDay = "前日"): string {
  if (m < 0) return prevDay + clock(m + 1440);
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}

/** 9:00（頭の 0 を省く。キャンバスのマスと帯の文字）。 */
export function clockShort(m: number): string {
  return clock(m).replace(/^0(?=\d:)/, "");
}

/** 9:00–18:00 */
export function spanShort(t: ArShiftGridTime): string {
  return `${clockShort(t.start)}–${clockShort(t.end)}`;
}

/** 09:00〜18:00 */
export function spanLong(t: ArShiftGridTime, prevDay?: string): string {
  return `${clock(t.start, prevDay)}〜${clock(t.end, prevDay)}`;
}

/** 範囲の中の位置（%）。 */
export function pct(m: number, range: readonly [number, number]): number {
  const [a, b] = range;
  return (Math.max(a, Math.min(b, m)) - a) / (b - a) * 100;
}

/** きざみに丸める。 */
export function snapTo(m: number, step: number): number {
  return Math.round(m / step) * step;
}

/** 帯の左端からの x（px）を時刻に。 */
export function xToMinute(x: number, width: number, range: readonly [number, number], step: number): number {
  const [a, b] = range;
  return snapTo(a + (x / Math.max(1, width)) * (b - a), step);
}

/** シフトの時間（休憩を引いた分）。 */
export function workMinutes(cell: ArShiftGridCell | undefined): number {
  if (!cell?.times?.length) return 0;
  const all = cell.times.reduce((a, t) => a + (t.end - t.start), 0);
  const br = (cell.breaks ?? []).reduce((a, t) => a + (t.end - t.start), 0);
  return Math.max(0, all - br);
}

export type DragKind = "move" | "start" | "end" | "new";

export interface ChartDrag {
  kind: DragKind;
  /** Selected interval; omitted for legacy whole-cell operations. */
  interval?: number;
  row: number;
  col: number;
  /** 移す先（move のとき、ほかの人・日）。 */
  toRow: number;
  toCol: number;
  x0: number;
  width: number;
  /** new のときの押した時刻。 */
  anchor: number;
  times: ArShiftGridTime[];
  breaks: ArShiftGridTime[];
  /** 今の（ドラッグ中の）時間。 */
  next: ArShiftGridTime[];
  nextBreaks: ArShiftGridTime[];
  moved: boolean;
}

/**
 * ドラッグの差（分）から新しい時間を作る。move は全体を、start は最初の帯の開始を、end は最後の帯の終了を動かす。
 * 休憩は帯の外へ出ないように寄せる。帯は 1 時間より短くしない。lo..hi の外へ出さない。
 */
export function applyDrag(d: ChartDrag, dm: number, lo: number, hi: number, step: number): { times: ArShiftGridTime[]; breaks: ArShiftGridTime[] } {
  const times = d.times.map((t) => ({ ...t }));
  let breaks = d.breaks.map((t) => ({ ...t }));
  if (d.kind === "new") {
    const h = Math.max(lo, Math.min(hi, d.anchor + dm));
    return { times: [{ start: Math.min(d.anchor, h), end: Math.max(d.anchor + step, h) }], breaks: [] };
  }
  if (!times.length) return { times, breaks };
  if (d.interval !== undefined) {
    const index = d.interval;
    const selected = times[index];
    if (!selected) return { times, breaks };
    const original = { ...selected };
    const lower = index > 0 ? Math.max(lo, times[index - 1]!.end) : lo;
    const upper = index + 1 < times.length ? Math.min(hi, times[index + 1]!.start) : hi;
    const minSpan = Math.min(60, original.end - original.start);
    if (d.kind === "move") {
      const delta = Math.max(lower - selected.start, Math.min(upper - selected.end, dm));
      selected.start += delta;
      selected.end += delta;
    } else if (d.kind === "start") selected.start = Math.max(lower, Math.min(selected.end - minSpan, selected.start + dm));
    else selected.end = Math.min(upper, Math.max(selected.start + minSpan, selected.end + dm));
    const delta = d.kind === "move" ? selected.start - original.start : 0;
    breaks = breaks.map((b) => {
      if (b.end <= original.start || b.start >= original.end) return b;
      return { start: Math.max(selected.start, b.start + delta), end: Math.min(selected.end, b.end + delta) };
    }).filter((b) => b.end > b.start);
    return { times, breaks };
  }
  const first = times[0]!;
  const last = times[times.length - 1]!;
  if (d.kind === "move") {
    const k = Math.max(lo - first.start, Math.min(hi - last.end, dm));
    return { times: times.map((t) => ({ start: t.start + k, end: t.end + k })), breaks: breaks.map((t) => ({ start: t.start + k, end: t.end + k })) };
  }
  if (d.kind === "start") {
    first.start = Math.max(lo, Math.min(first.end - 60, first.start + dm));
    breaks = breaks.map((b) => (b.start < first.start ? { start: first.start, end: Math.max(first.start, b.end) } : b)).filter((b) => b.end > b.start);
  } else {
    last.end = Math.min(hi, Math.max(last.start + 60, last.end + dm));
    breaks = breaks.map((b) => (b.end > last.end ? { start: Math.min(b.start, last.end), end: last.end } : b)).filter((b) => b.end > b.start);
  }
  return { times, breaks };
}

/** 選んだ範囲（向きをそろえる）。 */
export interface Rect {
  r0: number;
  r1: number;
  c0: number;
  c1: number;
}
export function norm(a: { r: number; c: number }, b: { r: number; c: number }): Rect {
  return { r0: Math.min(a.r, b.r), r1: Math.max(a.r, b.r), c0: Math.min(a.c, b.c), c1: Math.max(a.c, b.c) };
}
export function inRect(r: Rect | null, row: number, col: number): boolean {
  return !!r && row >= r.r0 && row <= r.r1 && col >= r.c0 && col <= r.c1;
}

/** 今の ARROW のオートフィル：選んだ範囲の右か下へ広げたときだけ。 */
export function fillRect(sel: Rect, to: { r: number; c: number }): Rect | null {
  const down = to.r > sel.r1;
  const right = to.c > sel.c1;
  if (!down && !right) return null;
  // 縦と横のうち、はみ出しが大きい向きへだけ広げる（表計算と同じ）
  if (down && (!right || to.r - sel.r1 >= to.c - sel.c1)) return { ...sel, r1: to.r };
  return { ...sel, c1: to.c };
}

/** 端末が Mac か。 */
export function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  const p = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform ?? "";
  return /mac|iphone|ipad/i.test(p);
}

/** YYYY-MM-DD の曜日（0＝日）。 */
export function weekdayOf(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1).getDay();
}

/** 塗りの上の文字の色（今の ARROW の suitableFontColor と同じ：明るさ 186 未満は白）。 */
export function inkOn(hex: string): "white" | "black" {
  let h = hex.replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6) return "white";
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if (![r, g, b].every(Number.isFinite)) return "white";
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  return 1.05 / (luminance + 0.05) >= (luminance + 0.05) / 0.05 ? "white" : "black";
}

/** 吹き出しの1行（label＝「シフト」、values＝時刻）。label が無い行は見出し（「千速 一真　10月21日（水）」）。 */
export interface TipRow {
  label?: string;
  values: string[];
}
