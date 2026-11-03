/**
 * ArDurationInput 1.0 の契約。時間の長さ（「1 時間 30 分」）を時間と分の2つの箱で打つ。値は分（例 90）。
 * 今の ARROW の Time（isNormalTime=false）にあたる。時刻ではないので 24 時間を越えてもよく、時間の箱は0を詰めない。
 */
export interface ArDurationInputProps {
  /** 分。未入力は null。 */
  modelValue: number | null;
  /** 時間の上限（既定 999）。 */
  maxHours?: number;
  invalid?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「休憩の長さ」）。 */
  label?: string;
  id?: string;
  /** 単位の文字。 */
  labels?: { hour: string; minute: string };
}
export interface ArDurationInputEmits {
  /** 箱からフォーカスが外れた・Enter のときに出す（分。分の箱が空なら null）。 */
  "update:modelValue": [value: number | null];
  commit: [value: number | null];
}
export type ArDurationInputPart = "root" | "hour" | "unit" | "minute";
