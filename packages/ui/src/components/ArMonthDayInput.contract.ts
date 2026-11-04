/** ArMonthDayInput 1.1 の契約。月と日を数字で入れる（今の ARROW の MonthDay。毎年の記念日・締め日など）。 */
export interface ArMonthDayInputProps {
  /** "MM-DD"。どちらかが空なら null。 */
  modelValue: string | null;
  invalid?: boolean;
  /** 大きさの段。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）。1.1 で足した。 */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** 読み上げ用の名前（例：「起算日」）。 */
  label?: string;
  id?: string;
  labels?: { month: string; day: string };
}
export interface ArMonthDayInputEmits {
  /** 打つたびに出す。どちらかが空・範囲外なら null。2月30日のような日は 2月29日に寄せる。 */
  "update:modelValue": [value: string | null];
}
export type ArMonthDayInputPart = "root" | "month" | "day" | "unit";
