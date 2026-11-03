/** ArDatePicker 1.0 の契約。 */
import type { ArDateRangeValue } from "./ArDateRange.contract";

export interface ArDatePickerProps {
  /** 1日なら "YYYY-MM-DD"（未入力は null）。range なら { start, end }。 */
  modelValue: string | null | ArDateRangeValue;
  /** 範囲を選ぶ（RangePicker）。間は淡いテーマ色、両端は塗り。 */
  range?: boolean;
  /** 選べる最初の日・最後の日（"YYYY-MM-DD"）。 */
  min?: string;
  max?: string;
  /** 入力欄を出さず、パネルだけをその場に出す（ポップアップの中に置くときなど）。 */
  inline?: boolean;
  /** 「今日」「決める」を出す。false なら日を押した時点で決まる。 */
  confirm?: boolean;
  /** range のとき入力欄の右に日数（30日間）を出す。 */
  showDays?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「イベントの日付」）。 */
  label?: string;
  labels?: {
    open: string;
    prev: string;
    next: string;
    today: string;
    ok: string;
    separator: string;
    title: (y: number, m: number) => string;
    weekdays: readonly string[];
    days: (n: number) => string;
  };
}
export interface ArDatePickerEmits {
  /** 「決める」を押した・入力欄を確定したときに出す（confirm=false なら日を押したとき）。 */
  "update:modelValue": [value: string | null | ArDateRangeValue];
  /** パネルを開いた・閉じた。 */
  "update:open": [open: boolean];
}
export type ArDatePickerPart = "root" | "row" | "start" | "separator" | "end" | "days" | "trigger" | "panel";
/** パネル（data-ar="date-picker-panel"）の部位。 */
export type ArDatePickerPanelPart = "head" | "nav" | "title" | "grid" | "row" | "weekday" | "day" | "foot";
