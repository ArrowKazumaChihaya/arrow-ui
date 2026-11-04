/** ArRadio 1.0 の契約。単独で置くラジオ（表の行の頭の選択・選択肢の行の中に表や入力を置く画面）。 */
import type { ArRadioValue } from "./ArRadioGroup.contract";

export interface ArRadioProps {
  /**
   * 今選ばれている値（同じ name のラジオで共有する v-model）。value と同じなら選ばれた形。
   * 今の ARROW の UI/Radio の value にあたる。
   */
  modelValue: ArRadioValue | null | undefined;
  /** このラジオの値。選ぶと update:modelValue にこの値を出す（UI/Radio の thisValue）。 */
  value: ArRadioValue;
  /** 同じまとまりのラジオに同じ name を付けると、←→↑↓ でまとまりの中を移れる。 */
  name?: string;
  disabled?: boolean;
  /** 間違いの形（赤い枠）。 */
  invalid?: boolean;
  /** 読み上げの名前（中身の文字がないとき。表の行なら「田中 太郎を選ぶ」など）。 */
  label?: string;
  /** input の id（ArField の label と結ぶ）。 */
  id?: string;
}
export interface ArRadioEmits {
  "update:modelValue": [value: ArRadioValue];
  /** 選んだとき（v-model と同じ値）。 */
  change: [value: ArRadioValue];
}
/** slot：default（丸の右の中身。文字でも部品でもよい。中身は丸と一緒に押せる）。 */
export type ArRadioPart = "root" | "control" | "input" | "mark" | "label";
