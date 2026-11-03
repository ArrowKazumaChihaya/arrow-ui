/** ArField 1.0 の契約。ラベル・必須・説明・間違いを1つにまとめ、中の入力と結ぶ。 */
export interface ArFieldProps {
  label: string;
  required?: boolean;
  help?: string;
  /** 間違いの文。直し方まで書く（例：「終了は開始より後の時刻にしてください」）。 */
  error?: string;
  /** stacked：ラベルが上。inline：ラベルが左（幅は labelSize）。 */
  layout?: "stacked" | "inline";
  labelSize?: "sm" | "md" | "lg";
  /** 必須の札の文字。 */
  requiredText?: string;
}
/** default slot に渡す値。中の入力に v-bind する。 */
export interface ArFieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: "true";
  "aria-required"?: "true";
  invalid: boolean;
}
export type ArFieldPart = "root" | "label" | "required" | "control" | "help" | "error";
