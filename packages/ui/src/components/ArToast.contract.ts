import type { ArIconName } from "../icons";

/** ArToast 1.0 の契約。 */
export interface ArToastProps {
  /** 出しているか（v-model:open）。 */
  open: boolean;
  /** 言葉（「末永 修也さんの10月21日のシフトを変更しました」など）。default slot でもよい。 */
  message?: string;
  /** 先頭の印。既定は check。false で出さない。 */
  icon?: ArIconName | false;
  /** 「元に戻す」の文字。渡すと出し、押すと undo。 */
  undoText?: string;
  /** 閉じるの文字。空文字にすると出さない。 */
  closeText?: string;
  /** 自然に消えるまでの秒数。0 で消えない。マウスが乗っている間は止まる。 */
  duration?: number;
  /** 下からの距離（px）。 */
  offset?: number;
  /** 画面全体ではなく、親の要素（position:relative）の下に出す。 */
  contained?: boolean;
}
export interface ArToastEmits {
  "update:open": [open: boolean];
  close: [];
  undo: [];
}
export type ArToastPart = "root" | "icon" | "text" | "undo" | "close";
