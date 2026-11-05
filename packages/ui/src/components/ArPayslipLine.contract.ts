/** ArPayslip内の1行。表示も入力欄も同じ表構造とテーマで並べる。 */
export interface ArPayslipLineProps {
  label?: string;
  value?: number | string;
  prev?: number | null;
  diff?: string;
  edited?: boolean;
  total?: boolean;
  big?: boolean;
  /** 入力欄用にラベルと値の幅を分ける。値や保存処理は利用側が持つ。 */
  editable?: boolean;
  compare?: "off" | "diff" | "prev";
  zeroDiff?: string;
  prevLabel?: string;
}
/** slot: label（項目名）、default（値・入力欄。labelIdをaria-labelledbyへ渡せる）。ArPayslipTable内で使う。 */
export type ArPayslipLinePart = "root" | "row" | "label" | "value" | "amount" | "edited" | "diff" | "prev";
