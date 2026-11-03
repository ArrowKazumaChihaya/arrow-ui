import type { ArIconName } from "../icons";

export type ArTreeKey = string | number;

/** ツリーの1つ。children があれば開け閉めできる。 */
export interface ArTreeNode {
  key: ArTreeKey;
  label: string;
  /** 名前の前のアイコン。folder（部署）・store（店舗）など。 */
  icon?: ArIconName;
  children?: readonly ArTreeNode[];
  disabled?: boolean;
  /** draggable のときでも、これだけは動かさない。 */
  fixed?: boolean;
}

/** ArTree 1.0 の契約。店舗・部署の階層。 */
export interface ArTreeProps {
  items: readonly ArTreeNode[];
  /** 選んでいるもの（v-model）。選ばないなら null。 */
  modelValue?: ArTreeKey | null;
  /** 開いているもの（v-model:expanded）。渡さなければ中で持つ。 */
  expanded?: readonly ArTreeKey[];
  /** 始めにすべて開く（expanded を渡さないとき）。 */
  defaultExpandAll?: boolean;
  /** 名前の前にチェックを出す（ArCheckbox）。親を付けると子もすべて付く。 */
  checkable?: boolean;
  /** チェックしたもの（v-model:checked）。親は子がすべて付いたとき付き、一部なら「一部」の印。 */
  checked?: readonly ArTreeKey[];
  /** 選べるか（false なら開け閉めとチェックだけ）。 */
  selectable?: boolean;
  /** つまみでドラッグして並べ替える（drop を出す。並べ替えるのは親）。キーボードでは Alt+↑↓。 */
  draggable?: boolean;
  /** 読み上げ用の名前（例：「店舗」）。 */
  label?: string;
}
/** 並べ替えの先。before / after は同じ親の中の前後、inside はその中の最後。 */
export interface ArTreeDrop {
  key: ArTreeKey;
  target: ArTreeKey;
  position: "before" | "after" | "inside";
}
export interface ArTreeEmits {
  "update:modelValue": [key: ArTreeKey];
  "update:expanded": [keys: ArTreeKey[]];
  "update:checked": [keys: ArTreeKey[]];
  /** 選んだとき（押す・Enter）。 */
  select: [node: ArTreeNode];
  /** ドラッグ・Alt+↑↓ で並べ替えたとき。 */
  drop: [drop: ArTreeDrop];
}
export type ArTreePart = "root" | "node" | "handle" | "switcher" | "check" | "icon" | "label" | "group";
