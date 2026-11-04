/**
 * ArDateTimeInput 1.1 の契約。日付（ArDateInput）と時刻（ArTimeInput の時と分のプルダウン）を並べ、1つの値にする。
 * 今の ARROW の Datetime にあたる。
 */
export interface ArDateTimeInputProps {
  /** Initial year for an empty draft; does not commit a date by itself. */
  initialYear?: number;
  /** Explicit available years, in the supplied order. */
  years?: readonly number[];
  /** Keep validation policy independent of the selected design. */
  invalidDate?: "clamp" | "message";
  yearOrder?: "asc" | "desc";
  allowEmptyYear?: boolean;
  pad?: "none" | "zero";
  /** Emit as fields are edited, preserving incomplete drafts. */
  updateOnInput?: boolean;

  /** "YYYY-MM-DD HH:mm:ss"（今の ARROW と同じ。秒は 00）。日付か時刻のどちらかが空なら null。 */
  modelValue: string | null;
  /** 年のプルダウンの最初の年。 */
  minYear?: number;
  /** 年のプルダウンの最後の年。 */
  maxYear?: number;
  /** 年に和暦を添える。 */
  era?: boolean;
  /** 分のプルダウンの刻み（今の ARROW は 5 分）。 */
  minuteStep?: number;
  /** 右に曜日を出す。 */
  showWeekday?: boolean;
  invalid?: boolean;
  /** 日付と時刻の欄の大きさの段。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）。1.1 で足した。 */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** 読み上げ用の名前（例：「公開日時」）。 */
  label?: string;
  id?: string;
  /** 時と分の単位の文字。 */
  labels?: { hour: string; minute: string };
}
export interface ArDateTimeInputEmits {
  /** 日付か時刻を変えたときに出す。 */
  "update:modelValue": [value: string | null];
}
export type ArDateTimeInputPart = "root";
