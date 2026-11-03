/** 数の入力（ArInputNumber・ArStepper）で共通の道具。ライブラリの中だけで使う。 */

/** 打った文字を数にする（全角の数字・カンマ・全角のマイナスも受け付ける）。数でなければ null。 */
export function parseNumber(text: string): number | null {
  const t = text.normalize("NFKC").replace(/[,\s]/g, "").replace(/[−ー‐]/g, "-");
  if (t === "" || t === "-" || t === ".") return null;
  if (!/^-?\d*\.?\d*$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** 範囲に収め、刻みの小数の桁にそろえる。 */
export function clampNumber(n: number, min?: number, max?: number, precision?: number): number {
  let v = n;
  if (min !== undefined) v = Math.max(min, v);
  if (max !== undefined) v = Math.min(max, v);
  if (precision !== undefined) v = Number(v.toFixed(precision));
  return v;
}

/** 刻みの小数の桁（0.5 → 1）。 */
export function decimalsOf(step: number): number {
  const s = String(step);
  const i = s.indexOf(".");
  return i < 0 ? 0 : s.length - i - 1;
}

/** 表示用の文字（3桁ごとのカンマ・小数の桁）。 */
export function formatNumber(n: number | null, grouping: boolean, precision?: number): string {
  if (n === null || Number.isNaN(n)) return "";
  const fixed = precision !== undefined ? n.toFixed(precision) : String(n);
  if (!grouping) return fixed;
  const [i = "", d] = fixed.split(".");
  const neg = i.startsWith("-");
  const body = (neg ? i.slice(1) : i).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${neg ? "-" : ""}${body}${d !== undefined ? `.${d}` : ""}`;
}

/** 押し続けると繰り返す（400ms 待って 60ms ごと）。 */
export function createRepeater() {
  let t1: ReturnType<typeof setTimeout> | undefined;
  let t2: ReturnType<typeof setInterval> | undefined;
  const stop = () => {
    if (t1) clearTimeout(t1);
    if (t2) clearInterval(t2);
    t1 = t2 = undefined;
  };
  const start = (fn: () => void) => {
    stop();
    fn();
    t1 = setTimeout(() => (t2 = setInterval(fn, 60)), 400);
  };
  return { start, stop };
}
