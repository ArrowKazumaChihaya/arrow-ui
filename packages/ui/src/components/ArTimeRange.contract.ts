/** ArTimeRange 1.2 の契約。 */
export interface ArTimeRangeValue {
  /** "HH:mm"。未入力は null。 */
  start: string | null;
  end: string | null;
}
export interface ArTimeRangeProps {
  modelValue: ArTimeRangeValue;
  /** 終わりは 24:00 以降（例 29:00）も受ける（夜勤）。 */
  overnight?: boolean;
  /** 開始にも24時以降を許可する。翌日開始のイベントなど。 */
  startOvernight?: boolean;
  /** ↑↓キーで動かす分。 */
  step?: 1 | 5 | 10 | 15 | 30;
  /** 時刻の欄の大きさの段（ArTimeInput と同じ）。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）。 */
  size?: "sm" | "md" | "lg";
  /** 外から渡す間違いの状態（両方を赤くする）。 */
  invalid?: boolean;
  /** 終わりが始まり以前のとき、終わりを赤くして下に直し方を出す。 */
  validate?: boolean;
  disabled?: boolean;
  /** 開始を入力の代わりに固定の説明として表示する。例：選んだシフトの開始時刻。modelValueは保持し、この側の更新を通知しない。 */
  startNote?: string;
  /** 終了を入力の代わりに固定の説明として表示する。例：選んだシフトの終了時刻。modelValueは保持し、この側の更新を通知しない。 */
  endNote?: string;
  /** 読み上げ用の名前（例：「イベントの時間」）。 */
  label?: string;
  labels?: { start: string; end: string; separator: string; reversed: string };
}
export interface ArTimeRangeEmits {
  /** どちらかを確定したときに出す。 */
  "update:modelValue": [value: ArTimeRangeValue];
  /** 変更した側だけを通知する。製品の独立した開始・終了の編集値へ接続する。 */
  "update:start": [value: string | null];
  "update:end": [value: string | null];
}
export type ArTimeRangePart = "root" | "row" | "start" | "separator" | "end" | "error";
