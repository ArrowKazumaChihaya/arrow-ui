/** ArCascader 1.0 の契約。 */
import type { ArIconName } from "../icons";

export type ArCascaderValue = string | number;

export interface ArCascaderOption {
  value: ArCascaderValue;
  label: string;
  /** 次の段（店舗・部署の階層）。 */
  children?: readonly ArCascaderOption[];
  disabled?: boolean;
}

export interface ArCascaderProps {
  /** 選んでいる道筋（上の段から順の値）。何も選んでいなければ null。 */
  modelValue: readonly ArCascaderValue[] | null;
  /** 階層の選択肢。 */
  options: readonly ArCascaderOption[];
  placeholder?: string;
  /** 見た目。field：入力と同じ枠。selbox：店舗の選択のような、アイコン＋名前＋下向きの印。 */
  variant?: "field" | "selbox";
  /** 頭に出すアイコン（例：store）。 */
  icon?: ArIconName;
  /** 大きさ。sm＝高さ30・md＝38・lg＝44。 */
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  /** 選んでいるとき、右に消すボタンを出す。 */
  clearable?: boolean;
  /** 途中の段（東京・大阪など）も選べる。 */
  changeOnSelect?: boolean;
  /** 次の段を開くきっかけ。click：押したとき。hover：乗せたとき。 */
  expandTrigger?: "click" | "hover";
  /** 道筋の区切り。 */
  separator?: string;
  /** 押す所に最後の段の名前だけを出す。 */
  displayLast?: boolean;
  /** 幅を親いっぱいにする。 */
  block?: boolean;
  /** 読み上げの名前（ArField の中では不要）。 */
  label?: string;
  /** 押す所の id（ArField の中ではスロットの id を渡す）。 */
  id?: string;
}

export type ArCascaderPart = "root" | "icon" | "value" | "placeholder" | "clear" | "arrow";
