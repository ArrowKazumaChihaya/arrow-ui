/** ArDateRange 1.0 の契約。 */
export interface ArDateRangeValue {
  /** "YYYY-MM-DD"。未入力は null。 */
  start: string | null;
  end: string | null;
}
export interface ArDateRangeProps {
  modelValue: ArDateRangeValue;
  minYear?: number;
  maxYear?: number;
  /** 右に「30日間」（両端を含む日数）を出す。 */
  showDays?: boolean;
  /** 外から渡す間違いの状態（両方を赤くする）。 */
  invalid?: boolean;
  /** 終わりの日が始まりの日より前のとき、両方を赤くして下に直し方を出す。 */
  validate?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「募集する期間」）。 */
  label?: string;
  labels?: { start: string; end: string; separator: string; days: (n: number) => string; reversed: string };
}
export interface ArDateRangeEmits {
  /** どちらかを確定したときに出す。 */
  "update:modelValue": [value: ArDateRangeValue];
}
export type ArDateRangePart = "root" | "row" | "start" | "separator" | "end" | "days" | "error";
