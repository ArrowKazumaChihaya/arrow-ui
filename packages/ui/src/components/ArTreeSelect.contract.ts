/**
 * ArTreeSelect 1.1 の契約。
 * 1.1：店舗（部署）の階層の選択（今の BranchSelectorInner）のために、
 * 「子店舗を含める」の切り替え（v-model:includeChildren）、プルダウンの下の操作（「部署/店舗追加」など。actions と action）、
 * 開いている部署の保存（v-model:expanded を製品が localStorage などに置く）、行ごとの選べない見出し（node.selectable:false）、
 * 先頭の「未選択」の行（nullOption。今の isNull）を足した。
 */
import type { ArIconName } from "../icons";

export type ArTreeSelectValue = string | number;

export interface ArTreeSelectNode {
  value: ArTreeSelectValue;
  label: string;
  /** 下の部署。 */
  children?: readonly ArTreeSelectNode[];
  disabled?: boolean;
  /** false で、この行だけ選べなくする（灰色にせず、押すと開け閉めする見出しの行。今の TreeOption の selectable:false）。 */
  selectable?: boolean;
}

/** プルダウンの下に出す操作のボタン。 */
export interface ArTreeSelectAction {
  value: string;
  label: string;
  icon?: ArIconName;
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
  /** 大きさの段。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）。 */
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
  /**
   * 「子店舗を含める」の切り替え（v-model:includeChildren）。渡すと、プルダウンの下に切り替え（チェック）を出し、
   * オンで下の部署のある部署を選んでいると、押す所に「子店舗を含む」の印を出す。省くと出さない。
   */
  includeChildren?: boolean;
  /** 切り替えの文字（既定「子店舗を含める」）。印の文字は includeChildrenMark（既定「子店舗を含む」）。 */
  includeChildrenLabel?: string;
  includeChildrenMark?: string;
  /** 先頭に「何も選ばない」行を出す（選ぶと null。今の TreeSelect の isNull）。true なら placeholder の文字、文字を渡せばその文字。 */
  nullOption?: boolean | string;
  /** プルダウンの下に出す操作のボタン（今の「部署/店舗追加」）。押すと action を出して閉じる。 */
  actions?: readonly ArTreeSelectAction[];
  /** 押す所の id（ArField の中ではスロットの id を渡す）。 */
  id?: string;
}

export interface ArTreeSelectEmits {
  "update:modelValue": [value: ArTreeSelectValue | null | ArTreeSelectValue[]];
  change: [value: ArTreeSelectValue | null | ArTreeSelectValue[]];
  "update:expanded": [value: ArTreeSelectValue[]];
  "open-change": [open: boolean];
  /** 「子店舗を含める」を切り替えた（v-model:includeChildren）。 */
  "update:includeChildren": [value: boolean];
  /** プルダウンの下の操作を押した（actions の value）。 */
  action: [value: string];
}

export type ArTreeSelectPart = "root" | "icon" | "value" | "placeholder" | "tags" | "tag" | "tag-remove" | "clear" | "arrow" | "include-mark";
/** プルダウン（data-ar="tree-select-panel"）の部位。 */
export type ArTreeSelectPanelPart = "search" | "list" | "node" | "switch" | "check" | "node-label" | "empty" | "footer" | "include" | "include-box" | "include-label" | "action";
