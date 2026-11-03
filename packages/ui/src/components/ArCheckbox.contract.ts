/** ArCheckbox 1.0 の契約。 */
export interface ArCheckboxProps {
  modelValue: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  /** default slot がないときの読み上げ用の名前。 */
  label?: string;
  id?: string;
}
