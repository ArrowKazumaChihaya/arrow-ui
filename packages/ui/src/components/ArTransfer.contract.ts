/** ArTransfer 1.0 の契約。 */
export type ArTransferValue = string | number;

export interface ArTransferItem {
  value: ArTransferValue;
  label: string;
  /** 探すときに名前と一緒に見る文字（ふりがな・社員番号など）。 */
  keywords?: string;
  disabled?: boolean;
}
export interface ArTransferProps {
  /** 右（選んだ側）にある値の並び。 */
  modelValue: readonly ArTransferValue[];
  items: readonly ArTransferItem[];
  /** 左と右の見出し（例：["未選択", "送る相手"]）。 */
  titles?: readonly [string, string];
  /** 数の単位（例：「名」→「6名」）。 */
  unit?: string;
  /** 一覧の上に探す欄を出す。 */
  searchable?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「シフト募集の相手」）。 */
  label: string;
  labels?: { search: string; toRight: string; toLeft: string; empty: string };
}
export interface ArTransferEmits {
  "update:modelValue": [value: ArTransferValue[]];
}
export type ArTransferPart = "root" | "list" | "head" | "count" | "body" | "search" | "item" | "empty" | "actions";
