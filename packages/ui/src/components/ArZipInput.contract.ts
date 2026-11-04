/** ArZipInput 1.1 の契約。class・style は外側、ほかの属性（tabindex・aria-*）とイベントは中の入力へ。ref から focus()・blur()・select()・input。郵便番号の入力（今の ARROW の Zip：「###-####」の形と、住所を引く）。 */
export interface ArZipInputProps {
  /** "123-4567"。空なら null。 */
  modelValue: string | null;
  /**
   * 7桁そろったときに住所を引く関数（製品が渡す。例：郵便番号の API を呼ぶ）。
   * 住所の文字を返すと address を出す。見つからなければ null。渡さなければ引かない。
   */
  lookup?: (zip: string) => Promise<string | null>;
  invalid?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「郵便番号」）。 */
  label?: string;
  id?: string;
  placeholder?: string;
  labels?: { searching: string; notFound: string; failed: string };
}
export interface ArZipInputEmits {
  /** 打つたびに出す（"123-4567" の形に直した値）。 */
  "update:modelValue": [value: string | null];
  /** 住所が見つかったとき。 */
  address: [address: string, zip: string];
}
export type ArZipInputPart = "root" | "status";
