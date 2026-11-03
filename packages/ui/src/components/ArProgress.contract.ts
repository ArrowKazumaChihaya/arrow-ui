/** ArProgress 1.0 の契約。 */
export interface ArProgressProps {
  /** line：線。circle：円。steps：刻み（いくつ中いくつ）。 */
  type?: "line" | "circle" | "steps";
  /** 進み具合（0〜100）。steps では steps と合わせて「いくつ目まで」に直す。 */
  percent?: number;
  /** normal：進行（テーマ色）。active：取り込み中（光が流れる）。success：終わり（緑）。exception：失敗（赤）。
   *  渡さなければ 100% で success。 */
  status?: "normal" | "active" | "success" | "exception";
  /** 刻みの数（type="steps"）。 */
  steps?: number;
  /** 円の大きさ。md 96px・sm 56px。 */
  size?: "sm" | "md";
  /** 右（円は真ん中）の数や印を出す。 */
  showInfo?: boolean;
  /** 数の代わりに出す言葉（「取り込み中」「3/5」）。 */
  label?: string;
  /** 読み上げの名前（「提出率」など）。 */
  ariaLabel?: string;
}
export type ArProgressPart = "root" | "track" | "bar" | "step" | "ring" | "ring-track" | "ring-bar" | "info";
