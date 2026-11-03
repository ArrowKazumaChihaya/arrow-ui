/** ArLink 1.0 の契約。 */
import type { ArIconName } from "../icons";

export interface ArLinkProps {
  /** 行き先。 */
  href?: string;
  /** _blank なら別のタブで開く（rel="noopener" を付ける）。 */
  target?: "_self" | "_blank";
  /** 押せない（色を薄くし、行き先を外す）。 */
  disabled?: boolean;
  /** 意味の色。何も渡さなければテーマ色。 */
  type?: "secondary" | "danger";
  /** 文字の前のアイコン。 */
  icon?: ArIconName;
  /** 下線。false で下線なし（hover で出る）。 */
  underline?: boolean;
}
export interface ArLinkEmits {
  click: [event: MouseEvent];
}
export type ArLinkPart = "root" | "icon" | "label";
