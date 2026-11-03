/** ArTextarea 1.0 の契約。 */
export interface ArTextareaAutosize {
  /** いちばん少ない行数。 */
  minRows?: number;
  /** いちばん多い行数（超えたら中でスクロール）。 */
  maxRows?: number;
}

export interface ArTextareaProps {
  /** 入っている文字。v-model で受け渡す。 */
  modelValue: string;
  /** 何も入っていないときの薄い文字（例：「例：本日の売上目標を共有」）。 */
  placeholder?: string;
  /** 行数（autosize のときは使わない）。 */
  rows?: number;
  /** 中身に合わせて高さを変える。true か { minRows, maxRows }。 */
  autosize?: boolean | ArTextareaAutosize;
  /** 入れられる文字数の上限。 */
  maxlength?: number;
  /** 右下に文字数を出す（maxlength があれば「10 / 200」）。 */
  showCount?: boolean;
  /** 見え方。outlined＝白地に枠。filled＝枠なしの灰色の地。 */
  variant?: "outlined" | "filled";
  /** 右下のつまみで高さを変えられるか。autosize のときは none。 */
  resize?: "vertical" | "none";
  invalid?: boolean;
  /** 注意の枠（黄）。 */
  warning?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  /** 読み上げの名前（ArField の中では不要）。 */
  label?: string;
  /** textarea の id（ArField の中ではスロットの id を渡す）。 */
  id?: string;
  name?: string;
}

export type ArTextareaPart = "root" | "input" | "count";
