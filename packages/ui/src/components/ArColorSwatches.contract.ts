/** ArColorSwatches 1.0 の契約。 */
export interface ArColorSwatch {
  /** "#RRGGBB"。 */
  value: string;
  /** 読み上げ用の色の名前（例：「紫」）。 */
  label: string;
}
export interface ArColorSwatchesProps {
  /** 選んでいる色（"#RRGGBB"、大文字小文字は問わない）。未選択は null。 */
  modelValue: string | null;
  /** 並べる色。既定はイベント・パターンの8色。 */
  colors?: readonly ArColorSwatch[];
  /** sm：22px（狭い所）。md：26px。 */
  size?: "sm" | "md";
  disabled?: boolean;
  /**
   * 色をこの数ずつ縦にまとめて並べる（同じ色の濃さ違いを縦に。今の ARROW の「色選択」は 4）。
   * まとまりは横に並び、入りきらなければ次の段へ折り返す。省くと1列に並べて折り返す。
   */
  groupSize?: number;
  /** まとまりの名前（読み上げ。例：「イベントの色」）。 */
  label: string;
}
export interface ArColorSwatchesEmits {
  "update:modelValue": [value: string];
}
export type ArColorSwatchesPart = "root" | "group" | "swatch";
