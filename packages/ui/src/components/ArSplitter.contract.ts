/** ArSplitter 1.0 の契約。 */
export interface ArSplitterProps {
  /** 最初のパネル（start）の大きさ（px）。v-model:size。渡さなければ defaultSize から始める。 */
  size?: number;
  /** 最初の大きさ（px か "40%"）。ダブルクリックでここへ戻る。 */
  defaultSize?: number | string;
  /** 最初のパネルの最小（px）。 */
  min?: number;
  /** 最初のパネルの最大（px）。渡さなければ「全体 − 後ろのパネルの最小」。 */
  max?: number;
  /** 後ろのパネル（end）の最小（px）。 */
  endMin?: number;
  /** horizontal：左右に分ける。vertical：上下に分ける。 */
  orientation?: "horizontal" | "vertical";
  /** つまみの読み上げの名前。 */
  label?: string;
  /** 外側に角丸12と線を付ける。 */
  bordered?: boolean;
  /** キーボードで動かす量（px）。Shift を押すと5倍。 */
  step?: number;
}
export interface ArSplitterEmits {
  "update:size": [size: number];
  /** ドラッグ・キー操作が終わったとき。 */
  resizeEnd: [size: number];
}
/** スロット：start（最初のパネル）・end（後ろのパネル）。 */
export type ArSplitterPart = "root" | "pane" | "bar";
