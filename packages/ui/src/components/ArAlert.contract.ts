import type { ArIconName } from "../icons";

/** ArAlert 1.1 の契約。 */
export interface ArAlertProps {
  /** info：案内（テーマ色の淡い面）。ok：終わったこと（緑）。warn：注意（橙）。danger：間違い（赤）。
   *  neutral：ロック中・権限など、操作できないことの帯（灰）。 */
  tone?: "info" | "ok" | "warn" | "danger" | "neutral";
  /** 見出し（太字）。本文はその下。 */
  title?: string;
  /** 先頭のアイコン。既定は種類ごと（info・ok は info・check、warn・danger は alert、neutral は lock）。false で出さない。 */
  icon?: ArIconName | false;
  /** 右に × を出す。押すと close。 */
  closable?: boolean;
  closeLabel?: string;
  /** ページの上いっぱいに置く帯（角丸なし）。 */
  banner?: boolean;
}
export interface ArAlertEmits {
  close: [];
}
/** slot：default（本文）、title（見出しの差し替え）、action（右の操作のボタン）。 */
export type ArAlertPart = "root" | "icon" | "content" | "title" | "body" | "action" | "close";
