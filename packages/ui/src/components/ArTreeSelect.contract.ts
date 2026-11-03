/** ArTreeSelect 1.0 の契約。 */
import type { ArIconName } from "../icons";

export type ArTreeSelectValue = string | number;

export interface ArTreeSelectNode {
  value: ArTreeSelectValue;
  label: string;
  /** 下の部署。 */
  children?: readonly ArTreeSelectNode[];
  disabled?: boolean;
}

export interface ArTreeSelectProps {
  /** 1つ選ぶときは値か null。multiple のときはチェックした一番下の部署の値の配列。 */
  modelValue: ArTreeSelectValue | null | readonly ArTreeSelectValue[];
  /** 部署の木。 */
  tree: readonly ArTreeSelectNode[];
  /** チェックで複数選ぶ。親をチェックすると下が全部入り、一部だけのときは親が indeterminate になる。 */
  multiple?: boolean;
  /** 1つ選ぶとき、下のある部署（親）は選べなくする。 */
  leafOnly?: boolean;
  /** 開いている部署の値（v-model:expanded）。省くと、選んでいる部署までを開いて出す。 */
  expanded?: readonly ArTreeSelectValue[];
  /** はじめに全部開く。 */
  defaultExpandAll?: boolean;
  /** プルダウンに探す欄を出す。 */
  searchable?: boolean;
  searchPlaceholder?: string;
  placeholder?: string;
  /** 見た目。field：入力と同じ枠（複数は札）。selbox：部署の選択のような、アイコン＋名前＋下向きの印。 */
  variant?: "field" | "selbox";
  /** 頭に出すアイコン（例：bld）。 */
  icon?: ArIconName;
  /** 押す所に「営業部 / 東京営業所」のように上の部署から出す。 */
  showPath?: boolean;
  /** 札を何枚まで出すか（multiple・field）。残りは「+n」。 */
  maxTags?: number;
  /** 大きさ。sm＝高さ30・md＝38・lg＝44。 */
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  emptyText?: string;
  /** 幅を親いっぱいにする。 */
  block?: boolean;
  /** プルダウンの高さの上限（px）。 */
  listHeight?: number;
  /** 読み上げの名前（ArField の中では不要）。 */
  label?: string;
  /** 押す所の id（ArField の中ではスロットの id を渡す）。 */
  id?: string;
}

export type ArTreeSelectPart = "root" | "icon" | "value" | "placeholder" | "tags" | "tag" | "tag-remove" | "clear" | "arrow";
