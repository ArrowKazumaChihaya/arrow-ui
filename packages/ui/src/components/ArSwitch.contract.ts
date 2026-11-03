/** ArSwitch 1.0 の契約。 */
export interface ArSwitchProps {
  modelValue: boolean;
  /** 読み上げ用の名前（例：「この日を公開する」）。 */
  label: string;
  /** 入っているときにつまみの左に出す文字（例：「公開」）。offText と一緒に渡す。 */
  onText?: string;
  /** 切れているときにつまみの右に出す文字（例：「非公開」）。 */
  offText?: string;
  /** md：36×20（文字ありは高さ22）。sm：28×16（文字は出さない）。 */
  size?: "sm" | "md";
  disabled?: boolean;
  /** 保存中。つまみの中で回る印を出し、押せなくする。 */
  loading?: boolean;
  id?: string;
}
export interface ArSwitchEmits {
  "update:modelValue": [value: boolean];
}
export type ArSwitchPart = "root" | "track" | "text" | "on" | "off" | "thumb" | "spinner";
