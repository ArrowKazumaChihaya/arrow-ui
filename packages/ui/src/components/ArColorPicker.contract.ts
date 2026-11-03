/** ArColorPicker 1.0 の契約。 */
import type { ArColorSwatch } from "./ArColorSwatches.contract";

/**
 * ArColorPicker 1.0 の契約。
 *
 * デザインが選ぶ形（ArDesign.forms.ArColorPicker）。値の受け渡しはどの形でも同じ。
 * - `panel`：`"popover"`（既定）＝色の見本の下に浮かぶ一覧（自由な色も選べる）。`"dialog"`＝真ん中のダイアログ（題「色選択」・幅372px）で色を選び、選ぶと閉じる（今の ARROW の Colorpicker）。dialog では自由な色は出さない。
 */
export interface ArColorPickerProps {
  /** "#RRGGBB"。未選択は null。 */
  modelValue: string | null;
  /** ふだん選ぶ決まった色。既定はイベント・パターンの8色。 */
  colors?: readonly ArColorSwatch[];
  /** 自由な色（色の面・色相の帯・HEX）を選べる。false なら決まった色だけ。 */
  custom?: boolean;
  /** 開いたときから自由な色の詳細を出しておく。 */
  detailOpen?: boolean;
  /** 色を何色ずつ縦にまとめて並べるか（ArColorSwatches の groupSize。今の ARROW の「色選択」は 4）。 */
  groupSize?: number;
  disabled?: boolean;
  /** 見るだけ（今の ARROW の Colorviewer）。色の見本だけを出し、押しても開かない。 */
  readonly?: boolean;
  /** 読み上げ用の名前（例：「イベントの色」）。 */
  label: string;
  labels?: { detail: string; hide: string; hex: string; saturation: string; hue: string; empty: string; title?: string };
}
export interface ArColorPickerEmits {
  /** 色を選ぶ・動かすたびに出す（"#RRGGBB"）。 */
  "update:modelValue": [value: string];
  "update:open": [open: boolean];
}
export type ArColorPickerPart = "root" | "chip" | "value";
/** パネル（data-ar="color-picker-panel"）の部位。 */
export type ArColorPickerPanelPart = "sv" | "sv-knob" | "hue" | "hue-knob" | "hex" | "swatches" | "detail";
