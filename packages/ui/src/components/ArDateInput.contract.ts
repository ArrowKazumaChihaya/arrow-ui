/** ArDateInput 1.0 の契約。年はセレクト、月と日は数字で入れる。 */
export interface ArDateInputProps {
  /** "YYYY-MM-DD"。未入力は null。 */
  modelValue: string | null;
  minYear?: number;
  maxYear?: number;
  showWeekday?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「契約開始日」）。 */
  label?: string;
  id?: string;
  labels?: { year: string; month: string; day: string; weekdays: readonly string[] };
}
export interface ArDateInputEmits {
  /** 年を選んだとき、月・日の入力を確定したときに出す。どれかが空なら null。 */
  "update:modelValue": [value: string | null];
}
export type ArDateInputPart = "root" | "year" | "month" | "day" | "unit" | "weekday";
