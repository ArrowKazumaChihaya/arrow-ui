/** ArField 1.0 の契約。ラベル・必須・説明・間違いを1つにまとめ、中の入力と結ぶ。 */
export interface ArFieldProps {
  /** 項目名（.lbl 12.5px 太字）。 */
  label: string;
  /** 必須の赤い札を出す。ArForm の rules に required があれば自動で付く。 */
  required?: boolean;
  /** 入力の下に出す説明（灰色の小さな文字）。 */
  help?: string;
  /** 間違いの文。直し方まで書く（例：「終了は開始より後の時刻にしてください」）。ArForm の中では name の検証結果が出る。 */
  error?: string;
  /** ArForm の model の名前。rules の検証結果を受け取る。 */
  name?: string;
  /**
   * stacked：ラベルが上（ポップアップ）。inline：ラベルが左・右寄せ（設定の画面）。ArForm の中では ArForm の layout。
   * toolbar：小さな灰色のラベルを左に添える（カードの頭の「店舗」「表示モード」など。幅は文字なり）。
   */
  layout?: "stacked" | "inline" | "toolbar";
  /** inline のラベルの幅。sm＝88px・md＝120px・lg＝168px。 */
  labelSize?: "sm" | "md" | "lg";
  /** inline のラベルの幅（CSS の長さ。例："25%"）。labelSize より優先。ArForm の中では ArForm の labelWidth。 */
  labelWidth?: string;
  /** 必須の札の文字。 */
  requiredText?: string;
  /** 入力の id を決める（省くと自動）。 */
  id?: string;
}
/** default slot に渡す値。中の入力に v-bind する。 */
export interface ArFieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: "true";
  "aria-required"?: "true";
  "aria-labelledby"?: string;
  invalid: boolean;
}
export type ArFieldPart = "root" | "label" | "required" | "control" | "help" | "error";
