/** ArDateRange 1.1 の契約。 */
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
  /** 大きさの段。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）。1.1 で足した。 */
  size?: "sm" | "md" | "lg";
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
