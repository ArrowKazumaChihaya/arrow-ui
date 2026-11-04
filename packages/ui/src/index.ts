/**
 * @s_and_a/arrow-ui — ARROW シリーズ共通の Vue 3 デザインライブラリ。
 * 公開するのはこのファイルに書いたものだけ（package.json の exports で閉じている）。
 */
import "./styles/index.css";

export { contracts, componentNames, designedComponents, structuralComponents } from "./contracts";
export type { ArComponentName } from "./contracts";
export { defineDesign, ArDesignError } from "./design";
export type { ArDesign } from "./design";
export { icons } from "./icons";
export type { ArIconName } from "./icons";
export { useArUi, captureArUiContext } from "./provider/context";
export { componentMeta } from "./contracts";
export * from "./components.generated";
// 知らせる仕組み（関数で出すもの：確かめ・メッセージ・通知）
export { useArConfirm, useArMessage, useArNotification } from "./feedback";
export type {
  ArConfirmOptions,
  ArMessageOptions,
  ArMessageApi,
  ArNotificationOptions,
  ArNotificationAction,
  ArNotificationApi,
} from "./feedback";
export type { ArSpace, ArAlign, ArJustify } from "./layout/types";
export type { ArPaletteName, ArPalette, ArTokenName, ArTokenValues } from "@s_and_a/arrow-ui-tokens";
