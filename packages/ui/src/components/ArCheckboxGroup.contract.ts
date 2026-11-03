/** ArCheckboxGroup 1.0 の契約。 */
export type ArCheckboxValue = string | number;

export interface ArCheckboxOption {
  value: ArCheckboxValue;
  label: string;
  disabled?: boolean;
}

export interface ArCheckboxGroupProps {
  /** 選んでいる値の並び（options の順に並べて出す）。 */
  modelValue: readonly ArCheckboxValue[];
  options: readonly ArCheckboxOption[];
  /** horizontal：横に並べる（折り返す）。vertical：縦に並べる。 */
  direction?: "horizontal" | "vertical";
  /** 上に「すべて」を出す。文字を渡すとその名前で出す（例：「全員」）。一部だけなら indeterminate。 */
  checkAll?: boolean | string;
  /** まとめて押せない。 */
  disabled?: boolean;
  /** まとまりの名前（読み上げ）。 */
  label: string;
}
export interface ArCheckboxGroupEmits {
  "update:modelValue": [value: ArCheckboxValue[]];
}
export type ArCheckboxGroupPart = "root" | "all" | "list";
