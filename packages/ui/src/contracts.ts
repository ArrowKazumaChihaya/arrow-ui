// このファイルは scripts/gen-registry.mjs が作る。手で直さない。
/**
 * 部品ごとの契約の版。props・slot・emits・部位を
 * 足したらマイナー版、変えた・消したらメジャー版を上げる（README「版の決まり」）。
 * 製品の arrow-ui.requires.ts はこの版に対して必要な範囲を宣言する。
 * 元は各部品の Ar*.meta.json。
 */
export const contracts = {
  ArThemeScope: "1.0.0",
  ArUiProvider: "1.1.0",
  ArCluster: "1.0.0",
  ArGrid: "1.0.0",
  ArSplit: "1.0.0",
  ArStack: "1.0.0",
  ArButton: "1.0.0",
  ArIcon: "1.0.0",
  ArTabs: "1.0.0",
  ArCheckbox: "1.0.0",
  ArDateInput: "1.0.0",
  ArField: "1.0.0",
  ArRadioGroup: "1.0.0",
  ArSelect: "1.0.0",
  ArSwitch: "1.0.0",
  ArTextInput: "1.0.0",
  ArTimeInput: "1.0.0",
  ArCard: "1.0.0",
  ArTable: "1.0.0",
  ArTag: "1.0.0",
  ArAlert: "1.0.0",
  ArModal: "1.0.0",
} as const;

export type ArComponentName = keyof typeof contracts;
export const componentNames = Object.keys(contracts) as ArComponentName[];

/** 見た目を持たず、デザインのライブラリが対応しなくてよい部品（並べるための基礎と仕組み）。 */
export const structuralComponents: readonly ArComponentName[] = [
  "ArThemeScope",
  "ArUiProvider",
  "ArCluster",
  "ArGrid",
  "ArSplit",
  "ArStack",
];

/** デザインが見た目を用意しなければならない部品。 */
export const designedComponents = componentNames.filter((n) => !structuralComponents.includes(n));

/** 説明のための情報（分類・日本語の名前）。 */
export const componentMeta: Record<ArComponentName, { group: string; ja: string; slug: string }> = {
  ArThemeScope: { group: "しくみ", ja: "ページの色を替える枠", slug: "theme-scope" },
  ArUiProvider: { group: "しくみ", ja: "デザインを当てる枠", slug: "provider" },
  ArCluster: { group: "並べる", ja: "横に並べる", slug: "cluster" },
  ArGrid: { group: "並べる", ja: "格子に並べる", slug: "grid" },
  ArSplit: { group: "並べる", ja: "左右に分ける", slug: "split" },
  ArStack: { group: "並べる", ja: "縦に並べる", slug: "stack" },
  ArButton: { group: "基本", ja: "ボタン", slug: "button" },
  ArIcon: { group: "基本", ja: "アイコン", slug: "icon" },
  ArTabs: { group: "移動", ja: "タブ", slug: "tabs" },
  ArCheckbox: { group: "入力", ja: "チェック", slug: "checkbox" },
  ArDateInput: { group: "入力", ja: "日付の入力", slug: "date-input" },
  ArField: { group: "入力", ja: "入力の項目", slug: "field" },
  ArRadioGroup: { group: "入力", ja: "ラジオ", slug: "radio-group" },
  ArSelect: { group: "入力", ja: "セレクト", slug: "select" },
  ArSwitch: { group: "入力", ja: "スイッチ", slug: "switch" },
  ArTextInput: { group: "入力", ja: "文字の入力", slug: "text-input" },
  ArTimeInput: { group: "入力", ja: "時刻の入力", slug: "time-input" },
  ArCard: { group: "表示", ja: "カード", slug: "card" },
  ArTable: { group: "表示", ja: "表", slug: "table" },
  ArTag: { group: "表示", ja: "札（タグ）", slug: "tag" },
  ArAlert: { group: "知らせる", ja: "お知らせ", slug: "alert" },
  ArModal: { group: "知らせる", ja: "ポップアップ", slug: "modal" },
};
