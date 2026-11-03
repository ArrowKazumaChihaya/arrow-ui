/** 左の目次。slug は URL の # に使う（英数字だけ）。 */
export interface NavItem {
  slug: string;
  name: string;
  /** 日本語の短い説明（目次の2行目）。 */
  ja: string;
}
export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const guides: NavItem[] = [
  { slug: "intro", name: "はじめに", ja: "しくみと使い方" },
  { slug: "designs", name: "デザイン", ja: "トークンとテーマ色" },
  { slug: "requires", name: "部品の宣言", ja: "足りないデザインは使えない" },
];

export const groups: NavGroup[] = [
  {
    title: "しくみ",
    items: [
      { slug: "provider", name: "ArUiProvider", ja: "デザインを配る" },
      { slug: "theme-scope", name: "ArThemeScope", ja: "ページの色" },
    ],
  },
  {
    title: "並べる",
    items: [
      { slug: "stack", name: "ArStack", ja: "縦に並べる" },
      { slug: "cluster", name: "ArCluster", ja: "横に並べる" },
      { slug: "grid", name: "ArGrid", ja: "格子" },
      { slug: "split", name: "ArSplit", ja: "2つに分ける" },
    ],
  },
  {
    title: "基本",
    items: [
      { slug: "button", name: "ArButton", ja: "ボタン" },
      { slug: "icon", name: "ArIcon", ja: "アイコン" },
      { slug: "tag", name: "ArTag", ja: "札" },
    ],
  },
  {
    title: "入力",
    items: [
      { slug: "field", name: "ArField", ja: "項目の枠" },
      { slug: "text-input", name: "ArTextInput", ja: "文字" },
      { slug: "select", name: "ArSelect", ja: "選ぶ" },
      { slug: "time-input", name: "ArTimeInput", ja: "時刻" },
      { slug: "date-input", name: "ArDateInput", ja: "日付" },
      { slug: "checkbox", name: "ArCheckbox", ja: "チェック" },
      { slug: "radio-group", name: "ArRadioGroup", ja: "1つを選ぶ" },
      { slug: "switch", name: "ArSwitch", ja: "切り替え" },
    ],
  },
  {
    title: "表示",
    items: [
      { slug: "table", name: "ArTable", ja: "表" },
      { slug: "card", name: "ArCard", ja: "まとまり" },
      { slug: "tabs", name: "ArTabs", ja: "タブ" },
    ],
  },
  {
    title: "知らせる",
    items: [
      { slug: "alert", name: "ArAlert", ja: "お知らせ" },
      { slug: "modal", name: "ArModal", ja: "ポップアップ" },
    ],
  },
];

export const allItems = [...guides, ...groups.flatMap((g) => g.items)];
