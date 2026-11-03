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
  direction?: "horizontal" | "vertical";
  disabled?: boolean;
  /** まとまりの名前（読み上げ）。 */
  label: string;
}
