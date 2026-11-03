/** ArColorPicker 1.0 の契約。 */
import type { ArColorSwatch } from "./ArColorSwatches.contract";

export interface ArColorPickerProps {
  /** "#RRGGBB"。未選択は null。 */
  modelValue: string | null;
  /** ふだん選ぶ決まった色。既定はイベント・パターンの8色。 */
  colors?: readonly ArColorSwatch[];
  /** 自由な色（色の面・色相の帯・HEX）を選べる。false なら決まった色だけ。 */
  custom?: boolean;
  /** 開いたときから自由な色の詳細を出しておく。 */
  detailOpen?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「イベントの色」）。 */
  label: string;
  labels?: { detail: string; hide: string; hex: string; saturation: string; hue: string; empty: string };
}
export interface ArColorPickerEmits {
  /** 色を選ぶ・動かすたびに出す（"#RRGGBB"）。 */
  "update:modelValue": [value: string];
  "update:open": [open: boolean];
}
export type ArColorPickerPart = "root" | "chip" | "value";
/** パネル（data-ar="color-picker-panel"）の部位。 */
export type ArColorPickerPanelPart = "sv" | "sv-knob" | "hue" | "hue-knob" | "hex" | "swatches" | "detail";
