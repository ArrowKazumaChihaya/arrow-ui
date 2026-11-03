import navGroups from "./nav.generated.json";
/** 左の目次。slug は URL の # に使う（英数字だけ）。 */
export interface NavItem {
  slug: string;
  name: string;
  /** 日本語の名前（目次と見出しに大きく出す）。 */
  ja: string;
}
export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const guides: NavItem[] = [
  { slug: "intro", name: "", ja: "はじめに" },
  { slug: "designs", name: "", ja: "デザインの値と色" },
  { slug: "requires", name: "", ja: "使う部品の宣言" },
];

export const groups: NavGroup[] = navGroups;

export const allItems = [...guides, ...groups.flatMap((g) => g.items)];
