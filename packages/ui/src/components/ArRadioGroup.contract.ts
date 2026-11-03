/** ArRadioGroup 1.0 の契約。 */
export type ArRadioValue = string | number | boolean;

export interface ArRadioOption {
  value: ArRadioValue;
  label: string;
  disabled?: boolean;
}

export interface ArRadioGroupProps {
  modelValue: ArRadioValue | null;
  options: readonly ArRadioOption[];
  /** radio：18px の丸。button：ボタン型（ArSegmented と同じ形。日・週・月の切り替えなど）。 */
  type?: "radio" | "button";
  /** 丸のときの並び。button は常に横。 */
  direction?: "horizontal" | "vertical";
  /** button のとき親の幅いっぱいに広げ、等分する。 */
  block?: boolean;
  disabled?: boolean;
  /** まとまりの名前（読み上げ）。 */
  label: string;
}
export interface ArRadioGroupEmits {
  "update:modelValue": [value: ArRadioValue];
}
export type ArRadioGroupPart = "root" | "item" | "control" | "input" | "mark" | "label";
