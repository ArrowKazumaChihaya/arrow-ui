/** ArTextarea 1.1 の契約。 */
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
  /** 親の配置幅いっぱいに広げる。横幅のあるメモ・住所・経路の入力用。 */
  block?: boolean;
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
  /** 文字と角丸の大きさの段。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）（高さは rows で決まる。文字は sm 13／md 14／lg 15px）。1.1 で足した。 */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  readonly?: boolean;
  /** 読み上げの名前（ArField の中では不要）。 */
  label?: string;
  /** textarea の id（ArField の中ではスロットの id を渡す）。 */
  id?: string;
  name?: string;
}

export type ArTextareaPart = "root" | "input" | "count";
