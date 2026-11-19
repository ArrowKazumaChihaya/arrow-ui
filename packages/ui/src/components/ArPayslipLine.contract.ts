/** ArPayslipLine 1.1 の契約。ArPayslip内の1行。表示も入力欄も同じ表構造とテーマで並べる。 */
export interface ArPayslipLineProps {
  label?: string;
  value?: number | string;
  prev?: number | null;
  diff?: string;
  /** 手で直した値（1.1：値の字をデザインの「手で直した」色にし、ペンの印に乗せると editedHint を出す）。 */
  edited?: boolean;
  /** 手で直した印の説明（ペンに乗せる・フォーカスすると出る吹き出し）。 */
  editedHint?: string;
  total?: boolean;
  big?: boolean;
  /** 入力欄用にラベルと値の幅を分ける。値や保存処理は利用側が持つ。 */
  editable?: boolean;
  compare?: "off" | "diff" | "prev";
  zeroDiff?: string;
  prevLabel?: string;
}
/** slot: label（項目名）、default（値・入力欄。labelIdをaria-labelledbyへ渡せる）。ArPayslipTable内で使う。 */
export type ArPayslipLinePart = "root" | "row" | "label" | "value" | "amount" | "edited" | "edited-mark" | "diff" | "prev";
