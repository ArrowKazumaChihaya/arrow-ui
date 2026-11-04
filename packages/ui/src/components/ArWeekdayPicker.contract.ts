/** ArWeekdayPicker 1.1 の契約。 */
/** 0＝日 … 6＝土、"holiday"＝祝日。 */
export type ArWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6 | "holiday";

export interface ArWeekdayPickerProps {
  /** 選んでいる曜日（日・月…土・祝の順に並べて出す）。 */
  modelValue: readonly ArWeekday[];
  /** 最後に「祝」を出す。 */
  holiday?: boolean;
  /** 月曜から並べる（月…日・祝）。 */
  startOnMonday?: boolean;
  /**
   * 大きさ（ラジオ・チェックと同じ段）。
   * xs：17×26（表の行の中。シフト募集の決まりの表。1.0 の sm）。
   * sm：30×30（設定の行など密集した所）。md：38×36（ポップアップ。シフトのキャンバスの .wd）。lg：42×42（スマホ・大きく押しやすく）。sm・md・lg の高さ・角丸はほかの入力と同じ段（30／36／42・9／10／11）。
   * 1.1 で sm の意味が変わった（1.0 の sm は xs）。
   */
  size?: "xs" | "sm" | "md" | "lg";
  disabled?: boolean;
  /** まとまりの名前（読み上げ。例：「繰り返す曜日」）。 */
  label: string;
  /** 日〜土・祝の文字。 */
  labels?: readonly string[];
}
export interface ArWeekdayPickerEmits {
  "update:modelValue": [value: ArWeekday[]];
}
export type ArWeekdayPickerPart = "root" | "day";
