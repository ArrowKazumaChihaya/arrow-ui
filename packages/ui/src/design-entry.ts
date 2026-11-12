/**デザインを作るための入口（@s_and_a/arrow-ui/デザイン）。部品を読み込まないので Node でも軽い。 */
export { defineDesign, ArDesignError } from "./design";
export type { ArDesign, ArDesignTone } from "./design";
export type { ArIconName } from "./icons";
export { contracts, componentNames, designedComponents, structuralComponents } from "./contracts";
export type { ArComponentName } from "./contracts";
