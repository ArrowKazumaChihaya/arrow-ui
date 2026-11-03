/** 日付の計算（ArDateInput の中身）。"YYYY-MM-DD" の文字列だけを扱い、時差の影響を受けない。 */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** 0 = 日曜。 */
export function weekdayOf(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function formatDate(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function splitDate(value: string | null | undefined): { y: number; m: number; d: number } | null {
  const m = value ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
  return m ? { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) } : null;
}

/** 数字の文字を数にする（全角も読む）。読めなければ null。 */
export function toNumber(text: string): number | null {
  const s = text.normalize("NFKC").trim();
  return /^\d{1,4}$/.test(s) ? Number(s) : null;
}

/** 月・日を範囲に収める（31日を2月にしたら末日）。 */
export function clampDate(y: number, m: number, d: number): string {
  const mm = Math.min(12, Math.max(1, m));
  const dd = Math.min(daysInMonth(y, mm), Math.max(1, d));
  return formatDate(y, mm, dd);
}

/** "YYYY-MM-DD" の日の通し番号（1970-01-01 からの日数）。比べる・差を出すのに使う。 */
export function dayNumber(value: string): number {
  const s = splitDate(value);
  return s ? Math.round(Date.UTC(s.y, s.m - 1, s.d) / 86400000) : NaN;
}

/** 日を足す。 */
export function addDays(value: string, days: number): string {
  const d = new Date((dayNumber(value) + days) * 86400000);
  return formatDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/** 月を足す（日は末日に寄せる）。 */
export function addMonths(value: string, months: number): string {
  const s = splitDate(value)!;
  const t = s.y * 12 + (s.m - 1) + months;
  return clampDate(Math.floor(t / 12), (t % 12) + 1, s.d);
}

/** 今日（端末の時計の日付）。 */
export function todayString(now = new Date()): string {
  return formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** 両端を含む日数（2026-11-01〜2026-11-30 は 30）。どちらかが無い・逆なら null。 */
export function inclusiveDays(start: string | null, end: string | null): number | null {
  if (!start || !end) return null;
  const n = dayNumber(end) - dayNumber(start) + 1;
  return Number.isFinite(n) && n > 0 ? n : null;
}
