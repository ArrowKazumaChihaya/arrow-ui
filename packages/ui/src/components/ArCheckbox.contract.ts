/** ArCheckbox 1.1 の契約。 */
import type { ArChoiceSize, ArChoiceVariant } from "./ArRadioGroup.contract";

export interface ArCheckboxProps {
  /** チェックしているか。 */
  modelValue: boolean;
  /** 一部だけ（「すべて」の下の一部を選んでいる）。テーマ色に白い横線。 */
  indeterminate?: boolean;
  /** 押せない。 */
  disabled?: boolean;
  /** default slot（見える名前）がないときの読み上げ用の名前。表の行のチェックでは必ず渡す（例：「末永 修也を選ぶ」）。 */
  label?: string;
  /** 入力の id（ArField の label と結ぶ）。 */
  id?: string;
  /**
   * 1.1：形。plain（既定）＝四角と文字だけ。card＝選ぶカード（ラジオの card と同じ面。年末調整の「メールを送る」など）。
   */
  variant?: ArChoiceVariant;
  /** 1.1：大きさ（sm＝四角16・13px、md＝18・13.5px、lg＝18・14px。ラジオと同じ段）。 */
  size?: ArChoiceSize;
  /** 1.1：名前の下の説明。 */
  description?: string;
  /**
   * 1.1：見た目だけのチェック（input を持たない）。役目（menuitemcheckbox・treeitem・option など）と aria-checked を
   * 持つ親の中に、チェックの印だけを置くときに使う（ArViewOptions の項目・ArTreeSelect の複数選択）。
   */
  decorative?: boolean;
}
export interface ArCheckboxEmits {
  "update:modelValue": [value: boolean];
}
export type ArCheckboxPart = "root" | "control" | "input" | "box" | "mark" | "label" | "description";
