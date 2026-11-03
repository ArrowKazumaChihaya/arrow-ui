/** ArTable 1.0 の契約。並べ替えと絞り込みはしない（データの順番は製品の Logic が決める）。 */
import type { ArIconName } from "../icons";
import type { ArAvatarTone } from "./ArAvatar.contract";

export type ArRowKey = string | number;

/** 名前の列の頭文字の丸。 */
export interface ArTableAvatar {
  /** 丸に出す文字。省くと値の1文字目。 */
  text?: string;
  /** 色。省くと seed から人ごとの色を選ぶ（seed もなければテーマ色）。 */
  tone?: ArAvatarTone;
  /** 人ごとの色を選ぶ元（社員の番号など）。同じ seed なら同じ色。 */
  seed?: string | number;
}

export interface ArTableColumn<Row> {
  /** 列の名前（slot の名前 cell-<key> にも使う）。 */
  key: string;
  /** 見出しの文字。 */
  title: string;
  /** 寄せ。省くと numeric の列は end、ほかは start。 */
  align?: "start" | "center" | "end";
  /** px。データに合わせた幅は数で渡してよい。省くと中身に合わせる。 */
  width?: number;
  /** 横にスクロールしても左に残す。左から続けて指定する。 */
  sticky?: boolean;
  /** 見出しを押すと並べ替えの印が変わり update:sort を出す。 */
  sortable?: boolean;
  /** セルに出す値。省くと row[key]。配列を返すと1行ずつ並べる（1日に2つの時間帯など）。 */
  value?: (row: Row) => unknown;
  /** 数字の列。等幅の数字にし、align を省くと右寄せにする。 */
  numeric?: boolean;
  /** 文字の強さ。strong＝太字（時刻など）、muted＝灰色（区分・休憩など）、note＝少し小さな補足の文（備考など）。 */
  emphasis?: "strong" | "muted" | "note";
  /** 名前の列：頭文字の丸を名前の前に付ける。true なら値の1文字目と人ごとの色。 */
  avatar?: boolean | ((row: Row) => ArTableAvatar);
  /** 名前の下の小さな灰色の文字（「通常勤務2」など）。color を渡すと文字の前に色の小さな四角（パターンの色）。 */
  sub?: (row: Row) => string | { text: string; color?: string } | undefined;
}

/**
 * 合計の行の1つのセル。文字か数、または小さな見出しつきの値（シフト画面の「出勤 / 4名」）。
 * span で右の列とつなげる（つないだ列の値は使わない）。
 */
export type ArTableFooterValue = string | number | { label?: string; value: string | number; span?: number };

export interface ArTableSort {
  key: string;
  order: "asc" | "desc";
}

export interface ArTableLabels {
  /** 見出しのチェックの名前。 */
  selectAll: string;
  /** 行のチェックの名前。 */
  selectRow: string;
  /** 開くボタンの名前。 */
  expand: string;
  /** 閉じるボタンの名前。 */
  collapse: string;
  /** 行の右端の操作の列の見出し（読み上げだけ）。 */
  actions: string;
}

export interface ArTableProps<Row> {
  /** 列。 */
  columns: readonly ArTableColumn<Row>[];
  /** 行のデータ（並べ替え・絞り込み・ページ分けは製品がしたもの）。 */
  rows: readonly Row[];
  /** 行を見分ける値（キーの名前か関数）。 */
  rowKey: keyof Row | ((row: Row) => ArRowKey);
  /** 表の名前（読み上げ・スクロール領域の名前）。 */
  caption: string;
  /**
   * 形。box＝外枠（角丸12・線）の中に見出しと行（ポップアップ・一覧の表）。
   * board＝外枠なし・見出しは角の丸い淡いテーマ色の帯・行は高め（シフト画面の「勤務メンバー」「勤務可能な人」）。
   */
  variant?: "box" | "board";
  /** 左にチェックを出して行を選べるようにする（見出しのチェックで表に出ている行をすべて）。 */
  selectable?: boolean;
  /** 選んでいる行の key（v-model:selected）。 */
  selected?: readonly ArRowKey[];
  /** 並べ替えの状態（v-model:sort）。 */
  sort?: ArTableSort | null;
  /** 左に開くボタンを出し、#expanded の中身を行の下に開けるようにする。 */
  expandable?: boolean;
  /** 開いている行の key（v-model:expanded）。 */
  expanded?: readonly ArRowKey[];
  /** 合計の行。列の key → 表示する値。#foot-<key> で差し替えられる。 */
  footer?: Readonly<Record<string, ArTableFooterValue>> | null;
  /** 見出しをスクロールしても上に残す。 */
  stickyHeader?: boolean;
  /** 行の高さ。compact は詰めた表（ポップアップの中の長い一覧など）。 */
  density?: "regular" | "compact";
  /** 行がないときの文。次にできることを書く（「上の『シフト追加』から登録できます」）。 */
  emptyText?: string;
  /** 行がないときの線のアイコン。 */
  emptyIcon?: ArIconName;
  /** 値が空（null・undefined・""）のセルに出す文字。 */
  blank?: string;
  /** 薄く出す行（シフトなし・ロック中など）。押せることは変わらない。 */
  rowOff?: (row: Row) => boolean;
  /** 読み上げの名前。 */
  labels?: Partial<ArTableLabels>;
}

export interface ArTableEmits<Row> {
  "update:selected": [keys: ArRowKey[]];
  "update:sort": [sort: ArTableSort | null];
  "update:expanded": [keys: ArRowKey[]];
  "row-click": [row: Row, index: number];
}

/**
 * slot：
 * cell-<key>（{ row, value, index }）・head-<key>（{ column }）・foot-<key>（{ value }）・expanded（{ row }）・empty、
 * actions（{ row, index }：行の右端の操作。アイコンだけのボタンに aria-label を付ける）、
 * before-rows（見出しのすぐ下・行の上。シフト画面の「シフト追加」）、
 * below（表の下。ArPagination や「表示内容」のプルダウンを置く）。
 */
export type ArTablePart =
  | "root"
  | "viewport"
  | "table"
  | "head"
  | "header-cell"
  | "sort"
  | "sort-icon"
  | "body"
  | "row"
  | "cell"
  | "person"
  | "name"
  | "sub"
  | "sub-mark"
  | "lines"
  | "check"
  | "select"
  | "check-box"
  | "expand-toggle"
  | "expanded-row"
  | "before-rows"
  | "actions"
  | "foot"
  | "foot-label"
  | "foot-value"
  | "empty"
  | "below";
