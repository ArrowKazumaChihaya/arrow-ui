/** ArMenu 1.0 の契約（ArDropdown もこの項目の形を使う）。 */
import type { ArIconName } from "../icons";

export interface ArMenuItem {
  /** 項目を見分ける値（選んだときに届く）。区切り・見出しにも重ならない値を付ける。 */
  key: string;
  /** item：項目（ふつう）。divider：区切り線。group：見出し（children をその下に並べる）。 */
  type?: "item" | "divider" | "group";
  /** 見える文字（見出しの文字）。 */
  label?: string;
  /** 文字の前のアイコン。 */
  icon?: ArIconName;
  /** 2行目の説明（シフトの「操作」メニューの「従業員に希望シフトを出してもらう」など）。 */
  description?: string;
  /** 危ない項目（削除など）。赤で出す。区切り線のあと・最後に置く。 */
  danger?: boolean;
  /** 選べない。 */
  disabled?: boolean;
  /** 権限がない。鍵のアイコンと灰色で出し、選べない。 */
  locked?: boolean;
  /** 子の項目（ArMenu では子メニュー、group では見出しの下の項目）。 */
  children?: readonly ArMenuItem[];
  /** 渡すとリンク（a 要素）にする。 */
  href?: string;
}

export interface ArMenuProps {
  /** 項目の並び。 */
  items: readonly ArMenuItem[];
  /** 選んでいる項目の key。v-model:selected。 */
  selected?: string;
  /** 開いている子メニューの key（mode="inline"）。v-model:openKeys。渡さなければ選んでいる項目の親を開く。 */
  openKeys?: readonly string[];
  /**
   * inline：子メニューをその場で開く（設定などの横のメニュー）。
   * vertical：子メニューを右に浮かせて出す。horizontal：横に並べる（下線のタブと同じ形）。子メニューは下に浮かせる。
   */
  mode?: "inline" | "vertical" | "horizontal";
  /** 大きさ。sm は Layout の Sider の中の小さな項目。 */
  size?: "sm" | "md";
  /** 外側の白い面と線（inline / vertical）。Sider の中では false。 */
  bordered?: boolean;
  /** 読み上げの名前。 */
  label: string;
}
export interface ArMenuEmits {
  "update:selected": [key: string];
  "update:openKeys": [keys: string[]];
  /** 項目を選んだ（子メニューを持たない項目）。 */
  select: [key: string, item: ArMenuItem];
}
export type ArMenuPart = "root" | "group" | "item" | "icon" | "label" | "arrow" | "divider";
