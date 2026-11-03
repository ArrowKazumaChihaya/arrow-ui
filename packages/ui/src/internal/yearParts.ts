/**
 * 年・年月・月日の入力（ArYearInput・ArYearMonthInput・ArMonthDayInput）の中身の計算。
 * 文字だけを扱い、時差の影響を受けない。
 */

/** 数字の文字を数にする（全角も読む）。読めなければ null。 */
export function digitsOf(text: string, max = 4): number | null {
  const s = text.normalize("NFKC").trim();
  return new RegExp(`^\\d{1,${max}}$`).test(s) ? Number(s) : null;
}

/** 西暦に和暦を添える（今の ARROW の year2nengo と同じ書き方）。例：2026 → "2026(令和8)"。 */
export function eraLabel(y: number): string {
  if (y < 1926) return `${y}(大正${y - 1911})`;
  if (y === 1926) return `${y}(昭和元/大正15)`;
  if (y < 1989) return `${y}(昭和${y - 1925})`;
  if (y === 1989) return `${y}(平成元/昭和64)`;
  if (y < 2019) return `${y}(平成${y - 1988})`;
  if (y === 2019) return `${y}(令和元/平成31)`;
  return `${y}(令和${y - 2018})`;
}

/** 年の並び（新しい年が上。今の ARROW と同じ）。 */
export function yearList(min: number, max: number, keep?: number | null): number[] {
  const lo = Math.min(min, keep ?? min);
  const hi = Math.max(max, keep ?? max);
  return Array.from({ length: hi - lo + 1 }, (_, i) => hi - i);
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** その月の日数（年が分からなければうるう年として 2月は29日）。 */
export function lastDay(month: number, year?: number | null): number {
  if (month === 2 && !year) return 29;
  return new Date(Date.UTC(year ?? 2000, month, 0)).getUTCDate();
}
