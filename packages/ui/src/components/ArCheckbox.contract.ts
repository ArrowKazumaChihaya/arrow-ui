/** ArCheckbox 1.0 の契約。 */
export interface ArCheckboxProps {
  /** チェックしているか。 */
  modelValue: boolean;
  /** 一部だけ（「すべて」の下の一部を選んでいる）。テーマ色に白い横線。 */
  indeterminate?: boolean;
  /** 押せない。 */
  disabled?: boolean;
  /** default slot（見える名前）がないときの読み上げ用の名前。表の行のチェックでは必ず渡す（例：「末永 修也を選ぶ」）。 */
  label?: string;
  /** 入力の id（ArField の label と結ぶ）。 */
  id?: string;
}
export interface ArCheckboxEmits {
  "update:modelValue": [value: boolean];
}
export type ArCheckboxPart = "root" | "control" | "input" | "box" | "mark" | "label";
