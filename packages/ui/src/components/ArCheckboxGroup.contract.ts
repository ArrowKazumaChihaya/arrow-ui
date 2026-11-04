/** ArCheckboxGroup 1.1 の契約。 */
import type { ArChoiceSize, ArChoiceVariant } from "./ArRadioGroup.contract";

export type ArCheckboxValue = string | number;

export interface ArCheckboxOption {
  value: ArCheckboxValue;
  label: string;
  /** 1.1：名前の下の説明（card で使う）。 */
  description?: string;
  disabled?: boolean;
}

export interface ArCheckboxGroupProps {
  /** 選んでいる値の並び（options の順に並べて出す）。 */
  modelValue: readonly ArCheckboxValue[];
  options: readonly ArCheckboxOption[];
  /** horizontal：横に並べる（折り返す）。vertical：縦に並べる。 */
  direction?: "horizontal" | "vertical";
  /**
   * 1.1：形。省くとデザインの既定（remix は card、classic は今の ARROW と同じ plain）。ArRadioGroup の variant と同じ考え方。
   * card＝選ぶカード（ラジオの card と同じ面）。plain＝四角と文字だけ（設定の行など密集した所）。
   */
  variant?: ArChoiceVariant;
  /** 1.1：大きさ（sm・md・lg。ArRadioGroup と同じ段）。 */
  size?: ArChoiceSize;
  /** 1.1：card のとき、この数の等しい幅の列に並べる。 */
  columns?: number;
  /** 上に「すべて」を出す。文字を渡すとその名前で出す（例：「全員」）。一部だけなら indeterminate。 */
  checkAll?: boolean | string;
  /** まとめて押せない。 */
  disabled?: boolean;
  /** まとまりの名前（読み上げ）。 */
  label: string;
}
export interface ArCheckboxGroupEmits {
  "update:modelValue": [value: ArCheckboxValue[]];
}
export type ArCheckboxGroupPart = "root" | "all" | "list";
