import type { ArIconName } from "../icons";

/** ArResult 1.0 の契約。 */
export interface ArResultProps {
  /** success：終わった（緑の丸にチェック）。error：失敗（赤）。info：案内（テーマ色）。warning：注意（橙）。
   *  "404" "403" "500"：大きな数（テーマ色）。 */
  status?: "success" | "error" | "info" | "warning" | "404" | "403" | "500";
  /** 見出し（18px 太字）。 */
  title: string;
  /** 見出しの下の説明（次にすること・しめきりなど）。 */
  description?: string;
  /** 丸の中の印を変える。 */
  icon?: ArIconName;
}
/** slot：default（次の一手：ボタンの並び）、icon（印の差し替え）。 */
export type ArResultPart = "root" | "badge" | "code" | "title" | "description" | "actions";
