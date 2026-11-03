/**
 * 選ぶ部品（ArSelect・ArAutoComplete・ArMentions・ArCascader・ArTreeSelect）で共通の小さな道具。
 * ライブラリの中だけで使う。
 */

/** 文字を比べるための形（大文字小文字・全角半角・ひらがなカタカナの違いを無くす）。 */
export function fold(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/** 文字を「合っている所」と「それ以外」に分ける（合っている文字をテーマ色の太字にするため）。 */
export interface ArTextPiece {
  text: string;
  match: boolean;
}
export function splitMatch(label: string, query: string): ArTextPiece[] {
  const q = fold(query.trim());
  if (!q) return [{ text: label, match: false }];
  const f = fold(label);
  // fold は1文字を1文字に写す（NFKC で長さが変わる文字は少ないので、長さが合うときだけ位置で切る）
  if (f.length !== label.length) {
    const i = label.indexOf(query.trim());
    return i < 0 ? [{ text: label, match: false }] : piecesAt(label, i, query.trim().length);
  }
  const i = f.indexOf(q);
  return i < 0 ? [{ text: label, match: false }] : piecesAt(label, i, q.length);
}
function piecesAt(label: string, i: number, n: number): ArTextPiece[] {
  return [
    { text: label.slice(0, i), match: false },
    { text: label.slice(i, i + n), match: true },
    { text: label.slice(i + n), match: false },
  ].filter((p) => p.text !== "");
}

/**
 * 読み（kana）で合ったとき、表示の名前のどこを強めるかを決める。
 * 読みと名前を空白で区切り、合った読みの語と同じ番目の語を強める（「さと」→ 読み「さとう だいち」→ 名前「佐藤 大地」の「佐藤」）。
 */
export function splitByReading(label: string, reading: string, query: string): ArTextPiece[] | null {
  const q = fold(query.trim());
  if (!q) return null;
  const words = reading.split(/[\s　]+/);
  const idx = words.findIndex((w) => fold(w).includes(q));
  if (idx < 0) {
    return fold(reading.replace(/[\s　]+/g, "")).includes(q) ? [{ text: label, match: true }] : null;
  }
  const parts = label.split(/([\s　]+)/);
  const labelWords = parts.filter((_, i) => i % 2 === 0);
  if (labelWords.length !== words.length) return [{ text: label, match: false }];
  let w = -1;
  return parts.map((p, i) => {
    if (i % 2 === 0) w++;
    return { text: p, match: i % 2 === 0 && w === idx };
  }).filter((p) => p.text !== "");
}

/** 名前の頭文字（丸に出す1文字）。 */
export function initialOf(label: string): string {
  return [...label.trim()][0] ?? "";
}

/** 文字で飛ぶ（打った文字で始まる次の項目へ）。続けて打った文字はつなげて探す。 */
export function createTypeahead(timeout = 600) {
  let buf = "";
  let timer: ReturnType<typeof setTimeout> | undefined;
  /** labels は項目ごとの名前（読みなども見るときは配列で）。 */
  return (key: string, labels: readonly (string | readonly string[])[], from: number, enabled: (i: number) => boolean): number => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => (buf = ""), timeout);
    buf += key;
    const q = fold(buf);
    const n = labels.length;
    // 同じ文字を続けて打ったときは次の候補へ回す
    const same = [...buf].every((c) => c === buf[0]);
    const start = buf.length === 1 || same ? from + 1 : from;
    const needle = same ? fold(buf[0]!) : q;
    for (let k = 0; k < n; k++) {
      const i = (start + k + n) % n;
      const l = labels[i] ?? "";
      const names = typeof l === "string" ? [l] : l;
      if (enabled(i) && names.some((n) => fold(n).startsWith(needle))) return i;
    }
    return -1;
  };
}

/** 次の使える項目へ（端で止まる）。 */
export function step(from: number, dir: 1 | -1, n: number, enabled: (i: number) => boolean): number {
  for (let i = from + dir; i >= 0 && i < n; i += dir) if (enabled(i)) return i;
  return from;
}
export function firstEnabled(n: number, enabled: (i: number) => boolean, fromEnd = false): number {
  for (let k = 0; k < n; k++) {
    const i = fromEnd ? n - 1 - k : k;
    if (enabled(i)) return i;
  }
  return -1;
}

/** 印字できる1文字のキーか（文字で飛ぶのに使う）。 */
export const isPrintableKey = (e: KeyboardEvent) => e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== " ";
