/** ArYearMonthInput 1.0 の契約。年はプルダウン、月は数字（今の ARROW の Yearmonth）。 */
export interface ArYearMonthInputProps {
  /** "YYYY-MM"。月が空なら null。 */
  modelValue: string | null;
  /** 一覧のいちばん古い年。既定は 1930。 */
  minYear?: number;
  /** 一覧のいちばん新しい年。既定は今年。 */
  maxYear?: number;
  /** 年に和暦を添える。 */
  era?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「対象の月」）。 */
  label?: string;
  id?: string;
  labels?: { year: string; month: string };
}
export interface ArYearMonthInputEmits {
  /** 年を選んだとき・月を打ったときに出す。月が空・範囲外なら null。 */
  "update:modelValue": [value: string | null];
}
export type ArYearMonthInputPart = "root" | "year" | "value" | "arrow" | "month" | "unit";
