/** ArFlagGroup 1.1 の契約。ビットの合計の数を、チェックの並びで入れる（今の ARROW の Flag。曜日・残業の扱いなど）。 */
import type { ArChoiceSize, ArChoiceVariant } from "./ArRadioGroup.contract";

export interface ArFlagOption {
  /** この項目のビット（1・2・4・8…）。 */
  value: number;
  label: string;
  /** 1.2: Explanation below the option label, rendered by ArCheckbox in both designs. */
  description?: string;
  disabled?: boolean;
}
export interface ArFlagGroupProps {
  /** 選んだ項目のビットの合計。null は 0 として扱う。 */
  modelValue: number | null;
  options: readonly ArFlagOption[];
  /** 出してよい項目のビットの合計（今の allowedFlag）。省くとすべて出す。 */
  allowed?: number;
  /** 縦に並べる（今の isVertical）。 */
  vertical?: boolean;
  disabled?: boolean;
  /** 1.1：大きさ（sm・md・lg。ArCheckboxGroup と同じ段）。 */
  size?: ArChoiceSize;
  /** 1.1：形。plain（既定。今の Flag と同じ並び）か card（選ぶカード）。 */
  variant?: ArChoiceVariant;
  /** 読み上げ用のまとまりの名前（例：「勤務する曜日」）。 */
  label?: string;
}
export interface ArFlagGroupEmits {
  "update:modelValue": [value: number];
}
export type ArFlagGroupPart = "root";
