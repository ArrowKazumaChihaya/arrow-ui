/** ArStepper 1.0 の契約。 */
export interface ArStepperProps {
  /** 今の数。v-model で受け渡す。 */
  modelValue: number;
  /** いちばん小さい数（人数なら1）。 */
  min?: number;
  /** いちばん大きい数。 */
  max?: number;
  /** − ＋ で変わる量。 */
  step?: number;
  /** 数の後ろの単位（例：「人」）。 */
  unit?: string;
  /**
   * 見た目。
   * joined：枠の中に − 数 ＋ を並べる（.stp・日にちなど範囲の決まった数）。
   * split：− と ＋ を小さな四角いボタンにして数を挟む（人数）。
   */
  variant?: "joined" | "split";
  /** 大きさ。sm＝高さ30・md＝38。 */
  size?: "sm" | "md";
  /** 真ん中の数を打って変えられる。 */
  editable?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  /** 読み上げの名前（例：「人数」）。 */
  label?: string;
  /** 数の入力の id（ArField の中ではスロットの id を渡す）。 */
  id?: string;
}

export type ArStepperPart = "root" | "decrement" | "value" | "increment" | "unit";
