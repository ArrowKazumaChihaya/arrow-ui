import { inject, type InjectionKey, type Ref } from "vue";
import type { ArPaletteName } from "@arrow/ui-tokens";
import type { ArDesign } from "../design";

export interface ArUiContext {
  design: Ref<ArDesign>;
  palette: Ref<ArPaletteName>;
  /** scope="self" のとき、ポップアップを出す先（デザインの範囲の中）。 */
  portal: Ref<HTMLElement | null>;
}

export const arUiContextKey: InjectionKey<ArUiContext> = Symbol("ArUi");

/** 部品の中から今のデザインとテーマ色を読む。Provider の外では null。 */
export function useArUi(): ArUiContext | null {
  return inject(arUiContextKey, null);
}

let seq = 0;
/** ラベルと入力を結ぶための id を作る。 */
export function useId(prefix = "ar"): string {
  seq += 1;
  return `${prefix}-${seq}`;
}
