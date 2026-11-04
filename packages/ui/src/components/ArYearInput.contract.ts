/** ArYearInput 1.1 の契約。年をプルダウンで選ぶ（今の ARROW の Year）。 */
export interface ArYearInputProps {
  /** 西暦の年。未選択は null。 */
  modelValue: number | null;
  /** 一覧のいちばん古い年。既定は 1930（今の ARROW と同じ）。 */
  minYear?: number;
  /** 一覧のいちばん新しい年。既定は今年。 */
  maxYear?: number;
  /** 和暦を添える（「2026(令和8)」。今の isNendo）。 */
  era?: boolean;
  /** 空（未選択）を選べるようにする。 */
  allowEmpty?: boolean;
  /** 後ろに「年」を出す。 */
  showUnit?: boolean;
  invalid?: boolean;
  /** 大きさの段。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）。1.1 で足した。 */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** 読み上げ用の名前（例：「対象の年」）。 */
  label?: string;
  id?: string;
  labels?: { year: string };
}
export interface ArYearInputEmits {
  "update:modelValue": [value: number | null];
}
export type ArYearInputPart = "root" | "year" | "value" | "arrow" | "unit";
