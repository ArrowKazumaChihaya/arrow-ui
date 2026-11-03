/** ArTextInput 1.0 の契約。 */
import type { ArIconName } from "../icons";

export interface ArTextInputProps {
  modelValue: string;
  type?: "text" | "search" | "password" | "tel" | "email";
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  /** 入力の頭に出すアイコン（例：search）。 */
  icon?: ArIconName;
  /** 入力の後ろに出す単位などの文字（例：「円」「分」）。 */
  suffix?: string;
  maxlength?: number;
  label?: string;
  id?: string;
  inputmode?: "text" | "numeric" | "decimal" | "tel" | "email" | "search";
  autocomplete?: string;
}
