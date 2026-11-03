/** ArPills 1.0 の契約。 */
export type ArPillValue = string | number;

export interface ArPillOption {
  value: ArPillValue;
  label: string;
  /** 右に出す数（例：件数）。 */
  count?: number;
  disabled?: boolean;
}
export interface ArPillsProps {
  /** multiple なら値の並び、そうでなければ1つの値（未選択は null）。 */
  modelValue: ArPillValue | null | readonly ArPillValue[];
  options: readonly ArPillOption[];
  /** いくつでも選ぶ。 */
  multiple?: boolean;
  /** 1つ選ぶとき、選んでいる札をもう一度押すと外す。 */
  allowClear?: boolean;
  disabled?: boolean;
  /** まとまりの名前（読み上げ。例：「表示する人」）。 */
  label: string;
}
export interface ArPillsEmits {
  "update:modelValue": [value: ArPillValue | null | ArPillValue[]];
}
export type ArPillsPart = "root" | "pill" | "count";
