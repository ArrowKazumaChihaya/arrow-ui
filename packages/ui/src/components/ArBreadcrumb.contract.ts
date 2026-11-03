/** ArBreadcrumb 1.0 の契約。 */
import type { ArIconName } from "../icons";
import type { ArMenuItem } from "./ArMenu.contract";

export interface ArBreadcrumbItem {
  /** 見える文字（アイコンだけのときは読み上げの名前）。 */
  label: string;
  /** 行き先。最後の項目（今のページ）には要らない。 */
  href?: string;
  /** 文字の前のアイコン。 */
  icon?: ArIconName;
  /** アイコンだけを見せる（ホームなど）。 */
  iconOnly?: boolean;
  /** 渡すと、押すとメニューが出る（同じ階層のほかの人・店舗へ移る）。cd のアイコンが付く。 */
  menu?: readonly ArMenuItem[];
}
export interface ArBreadcrumbProps {
  /** 上の階層から順に。最後が今のページ（太字）。 */
  items: readonly ArBreadcrumbItem[];
  /** 区切り。「/」か「›」。 */
  separator?: "/" | "›";
  /** 読み上げの名前。 */
  label?: string;
}
export interface ArBreadcrumbEmits {
  /** 項目を押した（href があるときは移動の前に出る）。 */
  click: [index: number, event: MouseEvent];
  /** メニューの項目を選んだ。 */
  select: [index: number, key: string];
}
export type ArBreadcrumbPart = "root" | "list" | "item" | "link" | "current" | "separator" | "icon";
