/** ArTimePicker 1.0 の契約。 */
export interface ArTimePickerProps {
  /** "HH:mm"。未入力は null。 */
  modelValue: string | null;
  /** 分の刻み（設定に合わせる：5・10・15分など）。パネルの分の列と ↑↓ の動き。 */
  minuteStep?: 1 | 5 | 10 | 15 | 30;
  /** 時の列の範囲（夜勤なら 0〜29 など）。既定は 0〜23。 */
  hours?: readonly [number, number];
  /** 入力欄を出さず、パネルだけをその場に出す。 */
  inline?: boolean;
  /** 「今」「決める」を出す。false なら分を押した時点で決まる。 */
  confirm?: boolean;
  /** 入力欄と時計のボタンの大きさの段（ArTimeInput と同じ）。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）。 */
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「開始」）。 */
  label?: string;
  labels?: { open: string; hour: string; minute: string; now: string; ok: string };
}
export interface ArTimePickerEmits {
  /** 「決める」・入力欄の確定で出す。 */
  "update:modelValue": [value: string | null];
  "update:open": [open: boolean];
}
export type ArTimePickerPart = "root" | "input" | "trigger";
/** パネル（data-ar="time-picker-panel"）の部位。 */
export type ArTimePickerPanelPart = "cols" | "col" | "cell" | "foot";
