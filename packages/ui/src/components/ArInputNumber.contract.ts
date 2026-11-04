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
  /** 大きさの段。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）。 */
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
