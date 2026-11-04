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
  if (a && typeof a === "object" && b && typeof b === "object") return a.time === b.time && a.day === b.day;
  if (a && typeof a === "object") return !a.time && (b === null || b === undefined || b === "");
  if (b && typeof b === "object") return !b.time && (a === null || a === undefined || a === "");
  return String(a ?? "") === String(b ?? "");
}
