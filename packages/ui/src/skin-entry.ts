/** skin を作るための入口（@arrow/ui/skin）。部品を読み込まないので Node でも軽い。 */
export { defineSkin, ArSkinError } from "./skin";
export type { ArSkin } from "./skin";
export { contracts, componentNames, skinnedComponents, structuralComponents } from "./contracts";
export type { ArComponentName } from "./contracts";
