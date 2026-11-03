/**
 * ArTreeTable 1.0 の契約。列のある木の表（店舗・部署の一覧など）。1列目が木（字下げ・開け閉め）。
 * 並べ替え・絞り込みはしない（データの順番は製品の Logic が決める）。ドラッグで動かしたときは、動かした後の木を update:rows で渡す。
 * デザインが選べる形（ArDesign.forms.ArTreeTable）：
 * - toggle："chevron"（既定。開け閉めは ›／∨）／"box"（四角の中の −／＋。antd の Tree の showLine。classic）。
 */
import type { ArRowKey } from "./ArTable.contract";

export interface ArTreeTableColumn<Row> {
  /** 列の名前（slot の名前 cell-<key> にも使う）。 */
  key: string;
  /** 見出しの文字。 */
  title: string;
  /** 寄せ。省くと numeric の列は end、ほかは start。 */
  align?: "start" | "center" | "end";
  /** px。省くと残りを分ける。 */
  width?: number;
  /** セルに出す値。省くと row[key]。 */
  value?: (row: Row) => unknown;
  /** 数字の列（等幅の数字・右寄せ）。 */
  numeric?: boolean;
}

/** 動かした先。before / after は target と同じ親の中の前後、inside は target の子の最後。 */
export interface ArTreeTableDrop {
  key: ArRowKey;
  target: ArRowKey;
  position: "before" | "after" | "inside";
}

export interface ArTreeTableLabels {
  /** 開くボタンの名前。 */
  expand: string;
  /** 閉じるボタンの名前。 */
  collapse: string;
  /** 動かすつまみの名前。 */
  dragHandle: string;
  /** 行の右端の操作の列の見出し（読み上げだけ）。 */
  actions: string;
  /** 動かしたあとに読み上げる文。 */
  moved: string;
}

export interface ArTreeTableProps<Row> {
  /** 列。1列目が木の列。 */
  columns: readonly ArTreeTableColumn<Row>[];
  /** 木のデータ（子は childrenKey の配列）。 */
  rows: readonly Row[];
  /** 行を見分ける値（キーの名前か関数）。 */
  rowKey: keyof Row | ((row: Row) => ArRowKey);
  /** 子の配列のキーの名前。既定 "children"。 */
  childrenKey?: string;
  /** 表の名前（読み上げ）。 */
  caption: string;
  /** 開いている行の key（v-model:expanded）。渡さなければ部品が覚える。 */
  expanded?: readonly ArRowKey[];
  /** はじめにすべて開く（expanded を渡さないとき）。今の ARROW の TreeTable と同じく既定は開く。 */
  defaultExpandAll?: boolean;
  /**
   * 行を動かせるようにする。1列目につまみが出る。マウスはつまみをつかんで行の上（前）・まん中（子に）・下（後）へ。
   * キーボードはつまみで Alt+↑↓（同じ親の中で前後）、Alt+→（すぐ上の行の子に）、Alt+←（親の後ろへ出す）。
   */
  draggable?: boolean;
  /** 動かしてよいか（false を返すと置けない）。省くとどこへでも（自分の下の行の中を除く）。 */
  allowDrop?: (drop: ArTreeTableDrop) => boolean;
  /** 合計の行。列の key → 表示する値（「店舗数」「4」など）。#foot-<key> で差し替えられる。 */
  footer?: Readonly<Record<string, string | number>> | null;
  /** 行がないときの文。 */
  emptyText?: string;
  /** 値が空のセルに出す文字。 */
  blank?: string;
  /** 読み上げの名前。 */
  labels?: Partial<ArTreeTableLabels>;
}

export interface ArTreeTableEmits<Row> {
  "update:expanded": [keys: ArRowKey[]];
  /** 動かした後の木（v-model:rows）。 */
  "update:rows": [rows: Row[]];
  /** 動かした1行。 */
  drop: [drop: ArTreeTableDrop];
  "row-click": [row: Row];
}

/**
 * slot：cell-<key>（{ row, value, depth }）・head-<key>（{ column }）・foot-<key>（{ value }）・
 * actions（{ row }：行の右端の操作）・before-rows（見出しのすぐ下。「店舗を追加」など）・empty・below（表の下）。
 */
export type ArTreeTablePart =
  | "root"
  | "viewport"
  | "table"
  | "head"
  | "header-cell"
  | "body"
  | "row"
  | "cell"
  | "tree"
  | "guide"
  | "toggle"
  | "toggle-box"
  | "drag-handle"
  | "content"
  | "before-rows"
  | "actions"
  | "foot"
  | "empty"
  | "below"
  | "status";
