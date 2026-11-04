/** ArRadioGroup 1.1 の契約。 */
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
/**
 * slot：label（{ option, checked }：名前の所に任意の部品。押すとラジオも選ぶ）、
 * extra（{ option, checked }：選択肢の下に置く表や入力。ラジオの外なので押しても切り替わらない。type="radio" のときだけ）。
 * 1つだけ離れた所に置くラジオは ArRadio を使う。
 */
export type ArRadioGroupPart = "root" | "item" | "control" | "input" | "mark" | "label" | "extra";
