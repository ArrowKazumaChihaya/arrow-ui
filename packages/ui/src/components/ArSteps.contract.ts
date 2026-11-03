/** ArSteps 1.0 の契約。 */
export type ArStepStatus = "wait" | "process" | "finish" | "error";

export interface ArStepItem {
  /** 手順の名前。 */
  title: string;
  /** 下の小さな説明（「10/1〜10/31」「待っています」など）。mini では出さない。 */
  description?: string;
  /** 状態を個別に決める（渡さなければ current から決まる）。 */
  status?: ArStepStatus;
  /** 押せない（clickable のときも戻れない）。 */
  disabled?: boolean;
}
export interface ArStepsProps {
  /** 手順の並び。 */
  items: readonly ArStepItem[];
  /** 今の手順（0 から）。v-model:current。 */
  current?: number;
  /** 今の手順の状態（error で赤）。 */
  status?: "process" | "error";
  /** horizontal：横（ページの手順）。vertical：縦（承認の流れ）。 */
  direction?: "horizontal" | "vertical";
  /** default：ふつう。mini：ポップアップの上の小さな手順（.stpr）。 */
  size?: "default" | "mini";
  /** 済んだ手順を押して戻れる。 */
  clickable?: boolean;
  /** 読み上げの名前。 */
  label?: string;
}
export interface ArStepsEmits {
  "update:current": [index: number];
  /** 手順を押した。 */
  change: [index: number];
}
export type ArStepsPart = "root" | "step" | "icon" | "content" | "title" | "description" | "connector";
