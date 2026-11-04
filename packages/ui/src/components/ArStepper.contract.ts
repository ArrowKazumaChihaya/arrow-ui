/** ArStepper 1.1 の契約。 */
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
  /** 大きさの段。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）。split の形の −＋ は sm 26／md 30／lg 36。lg は 1.1 で足した。 */
  size?: "sm" | "md" | "lg";
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
