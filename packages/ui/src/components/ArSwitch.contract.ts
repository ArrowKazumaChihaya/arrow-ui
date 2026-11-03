/** ArSwitch 1.0 の契約。 */
export interface ArSwitchProps {
  modelValue: boolean;
  /** 読み上げ用の名前（例：「この日を公開する」）。 */
  label: string;
  onText?: string;
  offText?: string;
  size?: "sm" | "md";
  disabled?: boolean;
  loading?: boolean;
}
