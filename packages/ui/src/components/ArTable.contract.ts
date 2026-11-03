/** ArTable 1.0 の契約。並べ替えと絞り込みはしない（データの順番は製品の Logic が決める）。 */
export type ArRowKey = string | number;

export interface ArTableColumn<Row> {
  key: string;
  title: string;
  align?: "start" | "center" | "end";
  /** px。データに合わせた幅は数で渡してよい。省くと中身に合わせる。 */
  width?: number;
  /** 横にスクロールしても左に残す。左から続けて指定し、width も渡す。 */
  sticky?: boolean;
  sortable?: boolean;
  /** セルに出す値。省くと row[key]。 */
  value?: (row: Row) => unknown;
}

export interface ArTableSort {
  key: string;
  order: "asc" | "desc";
}

export interface ArTableProps<Row> {
  columns: readonly ArTableColumn<Row>[];
  rows: readonly Row[];
  rowKey: keyof Row | ((row: Row) => ArRowKey);
  /** 表の名前（読み上げ・スクロール領域の名前）。 */
  caption: string;
  selectable?: boolean;
  selected?: readonly ArRowKey[];
  sort?: ArTableSort | null;
  expandable?: boolean;
  expanded?: readonly ArRowKey[];
  /** 合計の行。列の key → 表示する値。 */
  footer?: Readonly<Record<string, string | number>> | null;
  stickyHeader?: boolean;
  density?: "regular" | "compact";
  emptyText?: string;
  labels?: { selectAll: string; selectRow: string; expand: string; collapse: string };
}

export interface ArTableEmits<Row> {
  "update:selected": [keys: ArRowKey[]];
  "update:sort": [sort: ArTableSort | null];
  "update:expanded": [keys: ArRowKey[]];
  "row-click": [row: Row, index: number];
}

/** slot：cell-<key>（{ row, value, index }）、head-<key>（{ column }）、foot-<key>、expanded（{ row }）、empty。 */
export type ArTablePart =
  | "root"
  | "viewport"
  | "table"
  | "head"
  | "header-cell"
  | "sort"
  | "body"
  | "row"
  | "cell"
  | "select"
  | "expand-toggle"
  | "expanded-row"
  | "foot"
  | "empty";
