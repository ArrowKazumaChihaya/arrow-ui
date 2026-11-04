import { computed, inject, provide, type InjectionKey, type Ref } from "vue";
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

/** Capture during setup, then call in an imperative dialog's setup to retain its provider. */
export function captureArUiContext(): () => void {
  const context = useArUi();
  return () => { if (context) provide(arUiContextKey, context); };
}

let seq = 0;
/** ラベルと入力を結ぶための id を作る。 */
export function useId(prefix = "ar"): string {
  seq += 1;
  return `${prefix}-${seq}`;
}

/**
 * デザインが選んだ部品の形（ArDesign.forms）を読む。Provider の外や指定がなければ fallback。
 * 例：useDesignForm("ArTimeInput", "fields", "single")
 */
export function useDesignForm<T extends string>(component: string, key: string, fallback: T): import("vue").ComputedRef<T> {
  const ui = useArUi();
  return computed(() => ((ui?.design.value.forms as Record<string, Record<string, string>> | undefined)?.[component]?.[key] as T) ?? fallback);
}
