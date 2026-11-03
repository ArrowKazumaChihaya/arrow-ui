/** ArKanaInput 1.0 の契約。氏名とフリガナの入力（姓・名に分けて入れ、空白でつないだ1つの文字で受け渡す。今の ARROW の Split×4）。 */
export interface ArKanaInputProps {
  /** 氏名（「千速 一真」）。姓と名を半角の空白でつなぐ。空なら null。v-model:name。 */
  name: string | null;
  /** フリガナ（「チハヤ カズマ」）。v-model:kana。 */
  kana?: string | null;
  /** フリガナの欄を出す。 */
  showKana?: boolean;
  /** ひらがなで打ったフリガナを、確定したときカタカナに直す。 */
  katakana?: boolean;
  invalid?: boolean;
  /** フリガナだけの間違い。 */
  kanaInvalid?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「氏名」）。 */
  label?: string;
  id?: string;
  labels?: { last: string; first: string; lastKana: string; firstKana: string; kana: string };
}
export interface ArKanaInputEmits {
  "update:name": [value: string | null];
  "update:kana": [value: string | null];
}
export type ArKanaInputPart = "root" | "row";
