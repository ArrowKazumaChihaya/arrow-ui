/** ArRate 1.0 の契約。 */
export interface ArRateProps {
  /** 0〜count。allowHalf なら 0.5 刻み。 */
  modelValue: number;
  /** 星の数。 */
  count?: number;
  /** 半分の星を選べる（星の左半分を押すと .5）。 */
  allowHalf?: boolean;
  /** 同じ値をもう一度押すと 0 に戻す。 */
  allowClear?: boolean;
  /** 見せるだけ（面談の結果の表示など）。 */
  readonly?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「面談の評価」）。 */
  label: string;
}
export interface ArRateEmits {
  "update:modelValue": [value: number];
}
export type ArRatePart = "root" | "star" | "bg" | "fg";
