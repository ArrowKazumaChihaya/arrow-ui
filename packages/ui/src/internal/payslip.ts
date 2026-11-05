/** 明細の表示専用整形。金額の業務計算・丸めは利用側が所有する。 */
export const formatPayslipValue = (value: number | string) =>
  typeof value === "number" ? value.toLocaleString("ja-JP").replace("-", "−") : value;
export const isNegativePayslipValue = (value: number | string) => typeof value === "number" && value < 0;
export function payslipDifference(
  item: { value: number | string; prev?: number | null; diff?: string },
  zeroDiff: string,
) {
  if (item.diff !== undefined) {
    const sign = /^[−-]/.test(item.diff) ? "down" : /^\+/.test(item.diff) ? "up" : "zero";
    return { text: item.diff, sign };
  }
  if (typeof item.value !== "number" || item.prev === undefined || item.prev === null) return null;
  const difference = item.value - item.prev;
  if (difference === 0) return { text: zeroDiff, sign: "zero" };
  return { text: (difference > 0 ? "+" : "−") + Math.abs(difference).toLocaleString("ja-JP"), sign: difference > 0 ? "up" : "down" };
}
