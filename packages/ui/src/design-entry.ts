/**デザインを作るための入口（@arrow/ui/デザイン）。部品を読み込まないので Node でも軽い。 */
export { defineDesign, ArDesignError } from "./design";
export type { ArDesign } from "./design";
export { contracts, componentNames, designedComponents, structuralComponents } from "./contracts";
export type { ArComponentName } from "./contracts";
