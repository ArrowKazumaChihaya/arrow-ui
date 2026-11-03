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
  /** まとまりの名前（読み上げ。例：「イベントの色」）。 */
  label: string;
}
export interface ArColorSwatchesEmits {
  "update:modelValue": [value: string];
}
export type ArColorSwatchesPart = "root" | "swatch";
