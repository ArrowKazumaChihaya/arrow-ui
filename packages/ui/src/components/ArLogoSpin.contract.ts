/**
 * ArLogoSpin 1.0 の契約。ロゴを動かす読み込み中の印（今の ARROW の LogoSpin・CircleSpin・LogoBlink）。
 * ロゴの絵は製品が渡す（slot に SVG、または src に画像）。部品はロゴの見た目を変えず、動きだけを付ける。
 * slot の SVG で、回す輪に data-logo="ring"、矢に data-logo="mark" を付けると spin・circle で動く（付けない所は動かない）。
 */
export interface ArLogoSpinProps {
  /**
   * 動き。spin＝輪が 2.5 秒ごとに一回りし、矢が抜けて刺さり直す（LogoSpin）。circle＝輪だけが回り続ける（CircleSpin）。
   * blink＝ロゴ全体がゆっくり点滅する（LogoBlink）。src の画像は blink だけ（spin・circle は画像全体を回さない）。
   */
  motion?: "spin" | "circle" | "blink";
  /** ロゴの画像（slot の代わり）。 */
  src?: string;
  /** 読み上げる文。既定「読み込み中」。 */
  label?: string;
  /** 輪を回す中心（ロゴの viewBox の座標）。既定は ARROW のマーク（1024 の箱）の輪の中心 "344px 680px"。 */
  pivot?: string;
  /** 親いっぱいの広さのまん中に出す（画面全体の読み込み中）。 */
  fill?: boolean;
}
/** slot：default（ロゴの SVG）。 */
export type ArLogoSpinPart = "root" | "logo" | "image";
