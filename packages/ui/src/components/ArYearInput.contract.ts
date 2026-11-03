/** ArYearInput 1.0 の契約。年をプルダウンで選ぶ（今の ARROW の Year）。 */
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
