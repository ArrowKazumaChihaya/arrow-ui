/** ArSpin 1.0 の契約。 */
export interface ArSpinProps {
  /** 回しているか。default slot があるときは、中身の上に白い幕と輪を重ねる。 */
  spinning?: boolean;
  /** sm 16px（ボタンや文の中）・md 30px・lg 40px。 */
  size?: "sm" | "md" | "lg";
  /** 輪の下の言葉（「読み込み中」）。読み上げの名前にもなる。 */
  tip?: string;
  /** 独立した読込領域として横幅いっぱいに中央配置する。 */
  block?: boolean;
  /** 読込完了まで確保する領域の最小高さ。 */
  minHeight?: string;
}
/** slot：default（読み込む中身）。 */
export type ArSpinPart = "root" | "spinner" | "tip" | "content" | "mask";
