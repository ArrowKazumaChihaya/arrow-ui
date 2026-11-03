/** ArDivider 1.0 の契約。 */
export interface ArDividerProps {
  /** 横の線（ブロック同士の区切り）か、縦の線（文中の項目の区切り・高さ14px）。 */
  orientation?: "horizontal" | "vertical";
  /** 文字を置く位置（横の線で default slot があるとき）。 */
  align?: "center" | "start" | "end";
  /** 点線。 */
  dashed?: boolean;
  /** 文字を太字にしない（補足の文字）。 */
  plain?: boolean;
  /** 淡い線（カードの中のまとまりどうしの区切り。シフト画面の月の切り替えの下など）。 */
  subtle?: boolean;
  /** カードの本文の中で、左右の余白の外（カードの端から端）まで線を伸ばす（横の線のとき）。 */
  bleed?: boolean;
}
export type ArDividerPart = "root" | "text";
