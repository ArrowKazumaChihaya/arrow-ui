/** ArBalloon 1.0 の契約。吹き出しの形の注意・目印（今の ARROW の Balloon を広げたもの）。 */
export interface ArBalloonProps {
  /** しっぽを出す側。right なら右の物を指す（今の type）。 */
  tail?: "top" | "bottom" | "left" | "right";
  /** ink：濃い吹き出し（既定）。accent：テーマ色。danger：注意（赤）。warn：気をつける（橙の淡い面）。 */
  tone?: "ink" | "accent" | "danger" | "warn";
  /** bubble：言葉の吹き出し。dot：丸い目印（中にアイコン・顔写真・数を入れる。今のチャートの目印）。 */
  shape?: "bubble" | "dot";
  /** dot の直径（px）。既定 20。 */
  size?: number;
  /** 読み上げで知らせる（role="status"）。あとから出る注意に付ける。 */
  live?: boolean;
}
/** slot：default（言葉・アイコンなど）。 */
export type ArBalloonPart = "root" | "body";
