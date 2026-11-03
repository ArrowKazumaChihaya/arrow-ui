/** ArTimeRange 1.0 の契約。 */
export interface ArTimeRangeValue {
  /** "HH:mm"。未入力は null。 */
  start: string | null;
  end: string | null;
}
export interface ArTimeRangeProps {
  modelValue: ArTimeRangeValue;
  /** 終わりは 24:00 以降（例 29:00）も受ける（夜勤）。 */
  overnight?: boolean;
  /** ↑↓キーで動かす分。 */
  step?: 1 | 5 | 10 | 15 | 30;
  /** 時刻の欄の大きさ（ArTimeInput と同じ）。sm は表の中・ポップアップの行。 */
  size?: "sm" | "md" | "lg";
  /** 外から渡す間違いの状態（両方を赤くする）。 */
  invalid?: boolean;
  /** 終わりが始まり以前のとき、終わりを赤くして下に直し方を出す。 */
  validate?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「イベントの時間」）。 */
  label?: string;
  labels?: { start: string; end: string; separator: string; reversed: string };
}
export interface ArTimeRangeEmits {
  /** どちらかを確定したときに出す。 */
  "update:modelValue": [value: ArTimeRangeValue];
}
export type ArTimeRangePart = "root" | "row" | "start" | "separator" | "end" | "error";
