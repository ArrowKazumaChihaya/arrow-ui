/** ArTimeInput 1.0 の契約。 */
export interface ArTimeValue {
  /** "HH:mm"。未入力は null。 */
  time: string | null;
  /** same：当日、prev：前日。前日の切り替えを出さない時刻では常に same。 */
  day: "same" | "prev";
}
export interface ArTimeInputProps {
  modelValue: ArTimeValue;
  /** 枠と一体の［当日⇄前日］を出す（出勤・退勤・休憩）。シフトの開始・終了は false。 */
  dayShift?: boolean;
  /** ↑↓キーで動かす分。 */
  step?: 1 | 5 | 10 | 15 | 30;
  size?: "sm" | "md" | "lg";
  /** 外から渡す間違いの状態（例：終了が開始より前）。 */
  invalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** 読み上げ用の名前（例：「1行目の出勤」）。ArField の中なら id で結ぶので不要。 */
  label?: string;
  id?: string;
  labels?: { same: string; prev: string; toggleHint: string };
}
export interface ArTimeInputEmits {
  /** 確定したとき（Enter・フォーカスが外れた・切り替えを押した）だけ出す。入力中には出さない。 */
  "update:modelValue": [value: ArTimeValue];
  commit: [value: ArTimeValue];
  /** 読めない文字で確定しようとした。値は変えない。 */
  invalid: [text: string];
}
export type ArTimeInputPart = "root" | "day-toggle" | "input";
