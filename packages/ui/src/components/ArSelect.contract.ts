/** ArSelect 1.0 の契約。 */
export type ArSelectValue = string | number;

export interface ArSelectOption {
  value: ArSelectValue;
  label: string;
  disabled?: boolean;
}

export interface ArSelectGroup {
  label: string;
  options: readonly ArSelectOption[];
}

export interface ArSelectProps {
  modelValue: ArSelectValue | null;
  options: readonly (ArSelectOption | ArSelectGroup)[];
  /** 未選択の行の文字。null を選べるようにする。 */
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  /** 幅を中身ではなく親いっぱいにする。 */
  block?: boolean;
  label?: string;
  id?: string;
}
