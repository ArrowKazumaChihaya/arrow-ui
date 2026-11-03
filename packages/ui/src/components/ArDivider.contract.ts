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
}
export type ArDividerPart = "root" | "text";
