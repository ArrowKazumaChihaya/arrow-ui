/** ArYearMonthInput 1.1 の契約。年はプルダウン、月は数字（今の ARROW の Yearmonth）。 */
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
  /** 大きさの段。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）。1.1 で足した。 */
  size?: "sm" | "md" | "lg";
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
