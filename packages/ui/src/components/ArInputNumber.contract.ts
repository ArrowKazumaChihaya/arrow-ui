/** ArInputNumber 1.0 の契約。 */
export interface ArInputNumberProps {
  /** 入っている数。空なら null。v-model で受け渡す。 */
  modelValue: number | null;
  /** いちばん小さい数。 */
  min?: number;
  /** いちばん大きい数。 */
  max?: number;
  /** ▲▼・↑↓キーで増える量（Shift を押しながらだと10倍）。 */
  step?: number;
  /** 小数の桁。省くと step の桁。 */
  precision?: number;
  /** 3桁ごとにカンマを入れて見せる（1,200）。 */
  grouping?: boolean;
  /** 頭の文字（例：「¥」）。 */
  prefix?: string;
  /** 後ろの単位（例：「人」「円」「分」）。 */
  suffix?: string;
  /** 右に▲▼を出す。 */
  controls?: boolean;
  placeholder?: string;
  /** 大きさ。sm＝高さ30・md＝38・lg＝44。 */
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  /** 幅を親いっぱいにする。 */
  block?: boolean;
  /** 読み上げの名前（ArField の中では不要）。 */
  label?: string;
  /** input の id（ArField の中ではスロットの id を渡す）。 */
  id?: string;
  name?: string;
}

export type ArInputNumberPart = "root" | "prefix" | "input" | "suffix" | "steps" | "up" | "down";
