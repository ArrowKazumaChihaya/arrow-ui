import { inject, type InjectionKey, type Ref } from "vue";
import type { ArPaletteName } from "@arrow/ui-tokens";
import type { ArSkin } from "../skin";

export interface ArUiContext {
  skin: Ref<ArSkin>;
  palette: Ref<ArPaletteName>;
}

export const arUiContextKey: InjectionKey<ArUiContext> = Symbol("ArUi");

/** 部品の中から今の skin とテーマ色を読む。Provider の外では null。 */
export function useArUi(): ArUiContext | null {
  return inject(arUiContextKey, null);
}

let seq = 0;
/** ラベルと入力を結ぶための id を作る。 */
export function useId(prefix = "ar"): string {
  seq += 1;
  return `${prefix}-${seq}`;
}
