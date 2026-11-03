/** ArEmpty 1.0 の契約。 */
import type { ArIconName } from "../icons";

export interface ArEmptyProps {
  /** 何もないことと、次にできること（「上の『シフト追加』から登録できます」）。default slot でも渡せる。 */
  text?: string;
  /** 線のアイコン（inbox・search など）。絵は使わない。省くと文字だけ。 */
  icon?: ArIconName;
  /** 大きさ。sm は表やリストの中、md はカードの中の広い場所。 */
  size?: "sm" | "md";
}

/** slot：default（文）、action（次の一手のボタン）。 */
export type ArEmptyPart = "root" | "icon" | "text" | "action";
