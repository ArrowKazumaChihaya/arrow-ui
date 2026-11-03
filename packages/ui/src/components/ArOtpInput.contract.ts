/** ArOtpInput 1.0 の契約。認証コードの欄（6桁を1桁ずつの箱で。貼り付けで全部入る。再送までの秒数）。 */
export interface ArOtpInputProps {
  /** 入っている数字（つなげた文字列）。v-model で受け渡す。 */
  modelValue: string;
  /** 桁の数。 */
  length?: number;
  /** 間違いの枠（赤）。ArField の中では自動で付く。 */
  invalid?: boolean;
  disabled?: boolean;
  /** 読み上げの名前（箱ごとに「認証コード 1桁目」のように読む）。 */
  label?: string;
  /** 出たときに最初の箱へフォーカスする。 */
  autofocus?: boolean;
  /** 下に「認証コードを再送」のボタンを出す。 */
  resendable?: boolean;
  /** 再送を押せるようになるまでの秒数（送った直後なら 60 など）。変わるたびに数え直す。0 ならすぐ押せる。 */
  resendIn?: number;
  /** 再送したあと、次に押せるまでの秒数。 */
  cooldown?: number;
  /** 文言。{s} は残りの秒数。 */
  labels?: { resend?: string; wait?: string };
}
export interface ArOtpInputEmits {
  "update:modelValue": [value: string];
  /** 全部の桁が入ったとき。 */
  complete: [value: string];
  /** 再送を押したとき（このあと cooldown 秒は押せない）。 */
  resend: [];
}
/**
 * デザインが選ぶ形（ArDesign.forms.ArOtpInput）。
 * fields：split（既定。1桁ずつの箱。打つと次の箱へ、Backspace で前へ、貼り付けで全部の箱に入る）／ single（今の ARROW：1つの欄に6桁。placeholder「000000」）。
 * どちらも v-model の値（数字だけの文字列）と complete・resend は同じ。
 */
export type ArOtpInputPart = "root" | "fields" | "cell" | "input" | "resend";
