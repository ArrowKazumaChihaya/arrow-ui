/** ArDocumentBlock 1.0 の契約。書類の流れの1つのまとまり（指示の見出し＋中身の枠。上に「下へ進む」矢印）。 */
export interface ArDocumentBlockProps {
  /** 枠の上の見出し（「提出された書類を確認してください」など）。 */
  instruction?: string;
  /** 枠の上に「下へ進む」矢印を出す（前のまとまりから続くとき）。 */
  arrow?: boolean;
}
/** slot：default（枠の中身）。 */
export type ArDocumentBlockPart = "root" | "arrow" | "box" | "title";
