/**
 * 部品ごとの契約の版。props・slot・emits・部位を
 * 足したらマイナー版、変えた・消したらメジャー版を上げる（README「版の決まり」）。
 * 製品の arrow-ui.requires.ts はこの版に対して必要な範囲を宣言する。
 */
export const contracts = {
  ArUiProvider: "1.1.0",
  ArThemeScope: "1.0.0",
  ArStack: "1.0.0",
  ArCluster: "1.0.0",
  ArGrid: "1.0.0",
  ArSplit: "1.0.0",
  ArIcon: "1.0.0",
  ArButton: "1.0.0",
  ArField: "1.0.0",
  ArTimeInput: "1.0.0",
  ArDateInput: "1.0.0",
  ArTable: "1.0.0",
  ArModal: "1.0.0",
  ArTextInput: "1.0.0",
  ArSelect: "1.0.0",
  ArCheckbox: "1.0.0",
  ArRadioGroup: "1.0.0",
  ArSwitch: "1.0.0",
  ArTabs: "1.0.0",
  ArCard: "1.0.0",
  ArAlert: "1.0.0",
  ArTag: "1.0.0",
} as const;

export type ArComponentName = keyof typeof contracts;
export const componentNames = Object.keys(contracts) as ArComponentName[];

/** 見た目を持たず、デザインのライブラリが対応しなくてよい部品（並べるための基礎と仕組み）。 */
export const structuralComponents: readonly ArComponentName[] = [
  "ArUiProvider",
  "ArThemeScope",
  "ArStack",
  "ArCluster",
  "ArGrid",
  "ArSplit",
];

/**デザインが見た目を用意しなければならない部品。 */
export const designedComponents = componentNames.filter((n) => !structuralComponents.includes(n));
