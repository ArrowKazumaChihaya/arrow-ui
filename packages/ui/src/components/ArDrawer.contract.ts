import type { ArIconName } from "../icons";

/** ArDrawer 1.0 の契約。 */
export interface ArDrawerProps {
  open: boolean;
  title: string;
  /** 題の左のアイコン（人なら user など）。 */
  icon?: ArIconName;
  /** 出てくる側。 */
  placement?: "right" | "left";
  /** 幅（px か CSS の長さ）。既定 340。 */
  width?: number | string;
  /** 右上の × と Esc で閉じられる。 */
  closable?: boolean;
  /** 幕を押して閉じる。 */
  closeOnScrim?: boolean;
  /** 出す先。null にするとその場に出す。 */
  teleportTo?: string | null;
  /** 画面全体ではなく、親の要素（position:relative）の中に出す。 */
  contained?: boolean;
  labels?: { close: string };
}
export interface ArDrawerEmits {
  "update:open": [open: boolean];
  close: [];
}
/** slot：default（中身）、footer（足：キャンセルと主なボタン）、extra（頭の右の操作）。 */
export type ArDrawerPart = "root" | "scrim" | "panel" | "header" | "icon" | "title" | "extra" | "close" | "body" | "footer";
