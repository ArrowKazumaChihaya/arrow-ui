/** ArMonthDayInput 1.0 の契約。月と日を数字で入れる（今の ARROW の MonthDay。毎年の記念日・締め日など）。 */
export interface ArMonthDayInputProps {
  /** "MM-DD"。どちらかが空なら null。 */
  modelValue: string | null;
  invalid?: boolean;
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
