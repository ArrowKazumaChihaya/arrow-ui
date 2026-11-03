/** ArSlider 1.0 の契約。 */
export interface ArSliderMark {
  value: number;
  /** 下に出す文字（例：「15分」）。 */
  label?: string;
}
export interface ArSliderProps {
  /** 1つなら数、range なら [小さい方, 大きい方]。 */
  modelValue: number | readonly [number, number];
  /** 2つのつまみで範囲を選ぶ（チャートの表示時間など）。 */
  range?: boolean;
  min?: number;
  max?: number;
  /** 動く幅。null なら marks の値にだけ止まる。 */
  step?: number | null;
  /** 目盛り（点と下の文字）。 */
  marks?: readonly ArSliderMark[];
  /** つまみの上の吹き出し。auto：触っている間（hover・フォーカス・ドラッグ）だけ。 */
  tooltip?: "auto" | "always" | "never";
  /** 吹き出しと読み上げの文字（例：v => `${v}:00`）。 */
  format?: (value: number) => string;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「チャートの表示時間」）。range のときは「〜の始まり」「〜の終わり」になる。 */
  label: string;
}
export interface ArSliderEmits {
  /** 動かしている間ずっと出す。 */
  "update:modelValue": [value: number | [number, number]];
  /** 離したとき・キーで動かしたときに出す（保存はこちらで）。 */
  change: [value: number | [number, number]];
}
export type ArSliderPart = "root" | "rail" | "line" | "track" | "dot" | "mark" | "handle" | "tooltip";
