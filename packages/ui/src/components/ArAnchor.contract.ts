/** ArAnchor 1.0 の契約。 */
export interface ArAnchorItem {
  /** 見分ける値（v-model に入る）。 */
  key: string;
  /** 行き先（"#employment" など、ページの中の要素の id）。 */
  href: string;
  /** 見える文字。 */
  label: string;
  /** 1 は見出し、2 は一段下げた小見出し。 */
  level?: 1 | 2;
}
export interface ArAnchorProps {
  /** 目次の並び。 */
  items: readonly ArAnchorItem[];
  /** 今いるところの key。v-model（スクロールに合わせて変わる）。 */
  modelValue?: string;
  /** vertical：左に線の縦の目次。horizontal：下に線の横の目次。 */
  direction?: "vertical" | "horizontal";
  /** スクロールする箱（要素か CSS セレクタ）。渡さなければ画面。 */
  container?: HTMLElement | string;
  /** 上に固定のヘッダーなどがあるときの、上からの距離（px）。 */
  offset?: number;
  /** 読み上げの名前。 */
  label?: string;
}
export interface ArAnchorEmits {
  "update:modelValue": [key: string];
  /** 項目を押した。 */
  click: [key: string, event: MouseEvent];
}
export type ArAnchorPart = "root" | "link";
