/**
 * ArDurationInput 1.1 の契約。時間の長さ（「1 時間 30 分」）を時間と分の2つの箱で打つ。値は分（例 90）。
 * 今の ARROW の Time（isNormalTime=false）にあたる。時刻ではないので 24 時間を越えてもよく、時間の箱は0を詰めない。
 */
export interface ArDurationInputProps {
  /** 分。未入力は null。 */
  modelValue: number | null;
  /** 時間の上限（既定 999）。 */
  maxHours?: number;
  invalid?: boolean;
  /** 大きさの段。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）。1.1 で足した。 */
  size?: "sm" | "md" | "lg";
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
