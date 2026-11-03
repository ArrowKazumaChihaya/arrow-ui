/** ArText 1.0 の契約。 */
export type ArTextType = "secondary" | "muted" | "success" | "warning" | "danger" | "disabled";

export interface ArTextProps {
  /** 意味の色。secondary：補足（ink-2）、muted：さらに弱い補足、success：済み・提出、warning：注意、danger：間違い・削除、disabled：使えない。 */
  type?: ArTextType;
  /** 太字。 */
  strong?: boolean;
  /** 下線。 */
  underline?: boolean;
  /** 取り消し線（del）。 */
  del?: boolean;
  /** 黄色の印（mark）。 */
  mark?: boolean;
  /** コード（等幅・枠）。 */
  code?: boolean;
  /** キー（Enter など）。 */
  kbd?: boolean;
  /** 後ろにコピーのアイコンを出す。true なら中の文字を、文字列ならその文字をコピーする。 */
  copyable?: boolean | string;
  /** 1行に収まらないとき「…」で切る（全文は吹き出し）。幅は親か style で決める。 */
  ellipsis?: boolean;
  /** 文字の大きさ。sm は 12.5px、md は本文 13.5px。何も渡さなければ親の大きさを受け継ぐ。 */
  size?: "sm" | "md";
  /** コピーのボタンの読み上げ。 */
  labels?: { copy?: string; copied?: string };
}
export interface ArTextEmits {
  /** コピーした。 */
  copy: [text: string];
}
export type ArTextPart = "root" | "content" | "copy";
