/** ArTable の中だけで使う小さな関数。 */
import type { ArTableEditValue } from "../components/ArTable.contract";
import type { ArTimeValue } from "../components/ArTimeInput.contract";

/** 表の中の入力の key：「行のkey:列のkey」（段のあるときは「:段」）。 */
export const editKeyOf = (rowKey: string | number, colKey: string, line?: number) => `${String(rowKey)}:${colKey}${line === undefined ? "" : `:${line}`}`;

export const isBlankCell = (v: unknown) => v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);

/** 時刻の値にそろえる（"09:00" や null も受ける）。 */
export function toTimeValue(v: unknown): ArTimeValue {
  if (v && typeof v === "object" && "time" in (v as object)) {
    const t = v as ArTimeValue;
    return { time: t.time ?? null, day: t.day === "prev" ? "prev" : "same" };
  }
  return { time: v === null || v === undefined || v === "" ? null : String(v), day: "same" };
}

export function sameEditValue(a: ArTableEditValue | undefined, b: ArTableEditValue | undefined): boolean {
  if (Array.isArray(a) || Array.isArray(b)) {
    const x = toTimeRanges(a).filter(isFilledRange);
    const y = toTimeRanges(b).filter(isFilledRange);
    return x.length === y.length && x.every((r, i) => sameEditValue(r.start, y[i]!.start) && sameEditValue(r.end, y[i]!.end));
  }
  return sameSingle(a as Exclude<ArTableEditValue, readonly unknown[]> | undefined, b as Exclude<ArTableEditValue, readonly unknown[]> | undefined);
}
function sameSingle(a: Exclude<ArTableEditValue, readonly unknown[]> | undefined, b: Exclude<ArTableEditValue, readonly unknown[]> | undefined): boolean {
  if (a && typeof a === "object" && b && typeof b === "object") return a.time === b.time && a.day === b.day;
  if (a && typeof a === "object") return !a.time && (b === null || b === undefined || b === "");
  if (b && typeof b === "object") return !b.time && (a === null || a === undefined || a === "");
  return String(a ?? "") === String(b ?? "");
}

/** 時間の組（開始〜終了）にそろえる（{ start, end } の時刻は "09:00" でも { time, day } でもよい）。 */
export function toTimeRange(v: unknown): { start: ArTimeValue; end: ArTimeValue } {
  const o = (v && typeof v === "object" ? v : {}) as { start?: unknown; end?: unknown };
  return { start: toTimeValue(o.start), end: toTimeValue(o.end) };
}
export const toTimeRanges = (v: unknown) => (Array.isArray(v) ? v : v === null || v === undefined || v === "" ? [] : [v]).map(toTimeRange);
/** 開始か終了のどちらかが入っている組。 */
export const isFilledRange = (r: { start: ArTimeValue; end: ArTimeValue }) => !!r.start.time || !!r.end.time;
/** 表に出す「10:00〜19:00」（前日は頭に「前日」）。 */
export function formatTimeRange(v: unknown, sep = "〜"): string {
  const r = toTimeRange(v);
  const t = (x: ArTimeValue) => (x.time ? `${x.day === "prev" ? "前日" : ""}${x.time}` : "");
  return isFilledRange(r) ? `${t(r.start)}${sep}${t(r.end)}` : "";
}
