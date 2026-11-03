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
export { componentMeta } from "./contracts";
export * from "./components.generated";
export type { ArSpace, ArAlign, ArJustify } from "./layout/types";
export type { ArPaletteName, ArPalette, ArTokenName, ArTokenValues } from "@arrow/ui-tokens";
