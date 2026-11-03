/** ArKanaText 1.0 の契約。フリガナつきの氏名の表示（今の ARROW の Kana）。 */
export interface ArKanaTextProps {
  /** 氏名（default slot でもよい）。 */
  name?: string | null;
  /** フリガナ（kana slot でもよい）。 */
  kana?: string | null;
  /** stacked：名前の上に小さくフリガナ（既定。スマホの幅では「名前（フリガナ）」になる）。inline：いつも「名前（フリガナ）」。 */
  layout?: "stacked" | "inline";
}
/** slot：default（氏名）、kana（フリガナ）。 */
export type ArKanaTextPart = "root" | "kana" | "name" | "inline";
