/**
 * ArDateTimeInput 1.0 の契約。日付（ArDateInput）と時刻（ArTimeInput の時と分のプルダウン）を並べ、1つの値にする。
 * 今の ARROW の Datetime にあたる。
 */
export interface ArDateTimeInputProps {
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
