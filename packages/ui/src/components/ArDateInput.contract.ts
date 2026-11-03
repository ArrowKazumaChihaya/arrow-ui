/** ArDateInput 1.0 の契約。年はプルダウン、月と日は数字で入れる。 */
export interface ArDateInputProps {
  /** "YYYY-MM-DD"。未入力は null。 */
  modelValue: string | null;
  /** 年のプルダウンの最初の年。既定は今年の5年前。 */
  minYear?: number;
  /** 年のプルダウンの最後の年。既定は今年の5年後。 */
  maxYear?: number;
  /** 右に曜日（（金））を出す。日曜は赤、土曜は青。 */
  showWeekday?: boolean;
  /** 外から渡す間違いの状態（例：終わりの日が始まりの日より前）。 */
  invalid?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「契約開始日」）。 */
  label?: string;
  /** 年のボタンの id（ArField の label と結ぶ）。 */
  id?: string;
  labels?: { year: string; month: string; day: string; weekdays: readonly string[] };
}
export interface ArDateInputEmits {
  /** 年を選んだとき、月・日の入力を確定したとき（Enter・フォーカスが外れた・↑↓）に出す。どれかが空なら null。 */
  "update:modelValue": [value: string | null];
}
export type ArDateInputPart = "root" | "year" | "month" | "day" | "unit" | "weekday";
