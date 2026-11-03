/**
 * @arrow/ui — ARROW シリーズ共通の Vue 3 デザインライブラリ。
 * 公開するのはこのファイルに書いたものだけ（package.json の exports で閉じている）。
 */
import "./styles/structure.css";

export { contracts, componentNames, designedComponents, structuralComponents } from "./contracts";
export type { ArComponentName } from "./contracts";
export { defineDesign, ArDesignError } from "./design";
export type { ArDesign } from "./design";
export { icons } from "./icons";
export type { ArIconName } from "./icons";
export { useArUi } from "./provider/context";

export { default as ArUiProvider } from "./provider/ArUiProvider.vue";
export { default as ArThemeScope } from "./provider/ArThemeScope.vue";
export { default as ArStack } from "./layout/ArStack.vue";
export { default as ArCluster } from "./layout/ArCluster.vue";
export { default as ArGrid } from "./layout/ArGrid.vue";
export { default as ArSplit } from "./layout/ArSplit.vue";
export { default as ArIcon } from "./components/ArIcon.vue";
export { default as ArButton } from "./components/ArButton.vue";
export { default as ArField } from "./components/ArField.vue";
export { default as ArTimeInput } from "./components/ArTimeInput.vue";
export { default as ArDateInput } from "./components/ArDateInput.vue";
export { default as ArTable } from "./components/ArTable.vue";
export { default as ArModal } from "./components/ArModal.vue";
export { default as ArTextInput } from "./components/ArTextInput.vue";
export { default as ArSelect } from "./components/ArSelect.vue";
export { default as ArCheckbox } from "./components/ArCheckbox.vue";
export { default as ArRadioGroup } from "./components/ArRadioGroup.vue";
export { default as ArSwitch } from "./components/ArSwitch.vue";
export { default as ArTabs } from "./components/ArTabs.vue";
export { default as ArCard } from "./components/ArCard.vue";
export { default as ArAlert } from "./components/ArAlert.vue";
export { default as ArTag } from "./components/ArTag.vue";

export type { ArSpace, ArAlign, ArJustify } from "./layout/types";
export type { ArButtonProps, ArButtonPart } from "./components/ArButton.contract";
export type { ArFieldProps, ArFieldControlProps, ArFieldPart } from "./components/ArField.contract";
export type { ArTimeValue, ArTimeInputProps, ArTimeInputPart } from "./components/ArTimeInput.contract";
export type { ArDateInputProps, ArDateInputPart } from "./components/ArDateInput.contract";
export type {
  ArRowKey,
  ArTableColumn,
  ArTableSort,
  ArTableProps,
  ArTablePart,
} from "./components/ArTable.contract";
export type { ArModalProps, ArModalPart } from "./components/ArModal.contract";
export type { ArTextInputProps } from "./components/ArTextInput.contract";
export type { ArSelectProps, ArSelectOption, ArSelectGroup, ArSelectValue } from "./components/ArSelect.contract";
export type { ArCheckboxProps } from "./components/ArCheckbox.contract";
export type { ArRadioGroupProps, ArRadioOption, ArRadioValue } from "./components/ArRadioGroup.contract";
export type { ArSwitchProps } from "./components/ArSwitch.contract";
export type { ArTabsProps, ArTabItem } from "./components/ArTabs.contract";
export type { ArCardProps } from "./components/ArCard.contract";
export type { ArAlertProps } from "./components/ArAlert.contract";
export type { ArTagProps } from "./components/ArTag.contract";
export type { ArPaletteName, ArPalette, ArTokenName, ArTokenValues } from "@arrow/ui-tokens";
