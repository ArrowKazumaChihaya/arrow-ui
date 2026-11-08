/** ArZipInput 1.3 の契約。class・style は外側、ほかの属性（tabindex・aria-*）とイベントは中の入力へ。ref から focus()・blur()・select()・input。郵便番号の入力（今の ARROW の Zip：「###-####」の形と、住所を引く）。 */
export interface ArZipInputProps {
  /** "123-4567"。空なら null。 */
  modelValue: string | null;
  /**
   * 7桁そろったときに住所を引く関数（製品が渡す。例：郵便番号の API を呼ぶ）。
   * 住所の文字を返すと address を出す。見つからなければ null。渡さなければ引かない。
   * 入力時に自動検索する。失敗した場合だけ再試行ボタンを表示する。
   */
  lookup?: (zip: string) => Promise<string | null>;
  invalid?: boolean;
  /** 大きさの段。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）。1.2 で足した。 */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** 読み上げ用の名前（例：「郵便番号」）。 */
  label?: string;
  id?: string;
  placeholder?: string;
  labels?: { searching: string; notFound: string; failed: string; lookup?: string };
}
export interface ArZipInputEmits {
  /** 打つたびに出す（"123-4567" の形に直した値）。 */
  "update:modelValue": [value: string | null];
  /** 住所が見つかったとき。 */
  address: [address: string, zip: string];
}
export type ArZipInputPart = "root" | "lookup" | "status";
