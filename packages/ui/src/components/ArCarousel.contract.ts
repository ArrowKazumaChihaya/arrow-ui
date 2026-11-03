/** カルーセルの1枚。文字だけなら string、説明つきなら { title, description }。中身を自由にするなら item slot。 */
export type ArCarouselItem = string | { title: string; description?: string };

/** ArCarousel 1.0 の契約。お知らせの切り替え（地は帯と同じやわらかいグラデーション）。 */
export interface ArCarouselProps {
  /** 切り替える中身。item slot（{ item, index }）で形を変えられる。 */
  items: readonly ArCarouselItem[];
  /** 今の番号（0 から、v-model）。 */
  modelValue?: number;
  /** 自動で切り替える。true は 5 秒ごと、数はミリ秒。乗せている間・フォーカスの間は止まる。 */
  autoplay?: boolean | number;
  /** 最後の次は最初へ戻る。 */
  loop?: boolean;
  /** 左右の前後のボタンを出す。 */
  arrows?: boolean;
  /** 下の点を出す。 */
  dots?: boolean;
  /** 高さ（px か CSS の長さ）。既定はデザインが決める（remix は 150px）。 */
  height?: number | string;
  /** 読み上げ用の名前（例：「お知らせ」）。 */
  label?: string;
  /** 画面の文字。 */
  labels?: { prev: string; next: string; slide: string };
}
export interface ArCarouselEmits {
  "update:modelValue": [index: number];
}
export type ArCarouselPart = "root" | "viewport" | "track" | "slide" | "title" | "description" | "prev" | "next" | "dots" | "dot";
