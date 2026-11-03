/**
 * ArForm と ArField をつなぐ（ライブラリの中だけで使う）。
 * ArForm が並べ方・間違いを配り、ArField が name で自分の間違いを受け取る。
 */
import type { ComputedRef, InjectionKey, Ref } from "vue";

export interface ArFormContext {
  layout: Ref<"stacked" | "inline">;
  labelSize: Ref<"sm" | "md" | "lg">;
  /** inline のラベルの幅（CSS の長さ。labelSize より優先）。 */
  labelWidth: Ref<string | undefined>;
  /** name ごとの間違いの文（なければ undefined）。 */
  errorOf: (name: string) => string | undefined;
  /** name に必須の決まりがあるか。 */
  isRequired: (name: string) => boolean;
  /** ArField が出たとき・消えたとき（入力の id を覚える。間違いのまとめから飛ぶため）。 */
  register: (name: string, controlId: string, label: ComputedRef<string>) => void;
  unregister: (name: string, controlId: string) => void;
  /** フォーカスが外れたとき（validateOn="blur" なら確かめる）。 */
  touch: (name: string) => void;
}

export const arFormKey: InjectionKey<ArFormContext> = Symbol("ArForm");
