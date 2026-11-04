/** ArSegmented 1.1 の契約。 */
import type { ArIconName } from "../icons";

export interface ArSegmentedOption {
  /** 選んだときに v-model に入る値。 */
  value: string | number;
  /** 見える文字。アイコンだけのときも読み上げの名前として要る。 */
  label: string;
  /** 文字の前のアイコン。 */
  icon?: ArIconName;
  /** アイコンだけを見せる（label は読み上げ・ツールチップ）。 */
  iconOnly?: boolean;
  /** 選べない。 */
  disabled?: boolean;
  /** 文字の右の件数の丸（「備考 2」）。0 や省いたときは出さない。 */
  count?: number;
  /** 件数の丸の色。accent（既定・テーマ色）、warn（未回答など注意。淡い橙）、danger（間違い・不足）、neutral（灰）。 */
  countTone?: "accent" | "warn" | "danger" | "neutral";
}

export interface ArSegmentedProps {
  /** 選んでいる値。 */
  modelValue: string | number;
  /** 切り替えの選択肢（2〜4つ）。文字だけなら文字列の並びでもよい。 */
  options: readonly (ArSegmentedOption | string)[];
  /** 読み上げ用の名前（「表示モード」など）。 */
  label: string;
  /** 大きさ。sm 30・md 34・lg 42（外側の高さ）。 */
  size?: "sm" | "md" | "lg";
  /** 親の幅いっぱいに広げ、選択肢を等分する。 */
  block?: boolean;
  /** 全部を選べなくする。 */
  disabled?: boolean;
}
export interface ArSegmentedEmits {
  "update:modelValue": [value: string | number];
  /** 利用者が選び直したとき。 */
  change: [value: string | number];
}
export type ArSegmentedPart = "root" | "item" | "icon" | "label" | "count";
