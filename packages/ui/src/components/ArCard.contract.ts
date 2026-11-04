/** ArCard 1.0 の契約。 */
import type { ArIconName } from "../icons";

export interface ArCardProps {
  /** 見出し。band では帯の文字、ほかでは上の行の太字。 */
  title?: string;
  /** 見出しの前の線のアイコン。 */
  icon?: ArIconName;
  /**
   * 形。
   * band＝ページの大きなまとまり（白・角丸18・影、頭にテーマ色の帯）。
   * elevated＝中の小さなまとまり（白・角丸18・影）。
   * outlined＝中の小さなまとまり（白・角丸18・線）。
   * plain＝中のさらに小さな箱（白・角丸12・線。数字の箱など）。
   */
  variant?: "band" | "elevated" | "outlined" | "plain";
  /** 大きさ。band の sm は帯が低い（46px・15px）。ほかは余白が詰まる。 */
  size?: "md" | "sm";
  /** 本文の内側の余白をなくす（表などを端まで出すとき）。 */
  flush?: boolean;
  /** 見出しの段階（読み上げの見出しの深さ）。 */
  headingLevel?: 2 | 3 | 4;
}

/**
 * slot：title（見出し。title prop の代わりに補足や札を配置できる）、default（本文）、actions（見出しの右の操作・「詳しく」）、tabs（帯のすぐ下のタブの帯）、
 * cover（上の絵の場所）、footer（下に並ぶアイコンの操作。1つずつ区切る）。
 */
export type ArCardPart = "root" | "cover" | "head" | "title" | "icon" | "actions" | "tabs" | "body" | "footer";
