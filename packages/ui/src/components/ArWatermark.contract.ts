/** ArWatermark 1.0 の契約。 */
export interface ArWatermarkProps {
  /** うすく斜めに並べる文字（「ARROW 社外秘」など）。配列なら行を重ねる。 */
  content: string | readonly string[];
  /** 傾き（度）。 */
  rotate?: number;
  /** 1つ分の幅と高さ（px）。 */
  gapX?: number;
  gapY?: number;
  /** 文字の大きさ（px）。 */
  fontSize?: number;
}
/** slot：default（透かしを重ねる中身：給与明細・書類など）。 */
export type ArWatermarkPart = "root" | "content" | "mark";
