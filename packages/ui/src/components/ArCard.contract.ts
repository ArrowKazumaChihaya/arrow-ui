/** ArCard 1.0 の契約。 */
import type { ArIconName } from "../icons";

export interface ArCardProps {
  title?: string;
  icon?: ArIconName;
  variant?: "band" | "plain";
  /** 本文の内側の余白をなくす（表などを端まで出すとき）。 */
  flush?: boolean;
  /** 見出しの段階（読み上げの見出しの深さ）。 */
  headingLevel?: 2 | 3 | 4;
}
