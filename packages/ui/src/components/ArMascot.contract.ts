/**
 * ArMascot 1.0 の契約。マスコット（動くキャラクター）を表示し、名前で指定した動きを再生する。
 * 絵と動きは製品が渡す（1つの SVG と、動きを書いた CSS）。部品は絵の形や色を変えず、再生の制御だけをする。
 * 絵の色にテーマ色（--ar-accent など）を使うと、ページのテーマ色と利用者が選んだ色合いにそのまま従う。
 */

/** 1つの動き。 */
export interface ArMascotMotion {
  /** 1回の長さ（秒）。絵の CSS へ --duration として渡す。 */
  seconds: number;
  /** 繰り返す動きか。false は1回だけ動いて待機の動きへ戻る。 */
  loop: boolean;
  /** 動きの間の表情（絵の data-expression へ渡す）。絵が表情を持たないなら省く。 */
  expression?: string;
}

/**
 * 絵と動きの一式。製品が用意した信頼できる内容だけを渡す（部品は SVG をそのまま画面に入れる）。
 * script・イベント属性・javascript: を含む SVG は表示しない。
 */
export interface ArMascotArtwork {
  /** 絵の名前（英小文字・数字・ハイフン）。CSS の入れ分けに使う。同じ名前には同じ CSS を渡す。 */
  id: string;
  /** 1つの <svg>…</svg>。部品は data-motion・data-expression・--duration をこの svg に付ける。 */
  svg: string;
  /** 動きの CSS。svg の data-motion="<動きの名前>" で動きを切り替える書き方にする。 */
  css: string;
  /** 動きの名前 → 長さと繰り返し。 */
  motions: Record<string, ArMascotMotion>;
  /** 待機の動きの名前。既定 "idle"。1回だけの動きが終わるとここへ戻る。 */
  idle?: string;
}

export interface ArMascotProps {
  /** 絵と動きの一式（SVG・CSS・動きの一覧）。製品が用意したものだけを渡す。 */
  artwork: ArMascotArtwork;
  /** 再生する動きの名前。artwork.motions にない名前は待機の動きにする。既定は待機の動き。 */
  motion?: string;
  /** 同じ動きをもう一度最初から再生したいときに、値を変える（回数など）。 */
  replay?: number;
  /** 繰り返すかを動きの既定から変える。 */
  loop?: boolean;
  /** 動きを止める。 */
  paused?: boolean;
  /** 読み上げる名前（「シフトくん」など）。 */
  label: string;
  /** 幅。数値は px。既定はデザインが決める。高さは絵の比率に従う。 */
  size?: number | string;
}

export interface ArMascotEmits {
  /** 1回だけの動きが終わった（このあと待機の動きに戻る）。 */
  motionend: [motion: string];
}

export type ArMascotPart = "root" | "figure";
