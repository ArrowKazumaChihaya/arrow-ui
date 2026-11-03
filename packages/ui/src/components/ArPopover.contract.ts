import type { ArPlacement } from "../internal/floating";

/** ArPopover 1.0 の契約。default slot が基準の要素、content slot が中身。 */
export interface ArPopoverProps {
  /** 見出し（太字）。title slot でも渡せる。 */
  title?: string;
  /** 中身の文字。content slot があればそちらを使う。variant="cell" では改行（\n）でそのまま行を分ける。 */
  content?: string;
  /** 置く向き。入らなければ反対へ返す。 */
  placement?: ArPlacement;
  /** click：押すと開き、もう一度押す・外を押す・Escape で閉じる。hover：乗せると開く（フォーカスでも開く）。 */
  trigger?: "click" | "hover";
  /**
   * card：白い吹き出し（角丸12・sh-pop・矢印）。
   * cell：シフトのマスに乗せたときの時間の表示（濃い地・矢印なし・マスの端にそろえる・中のものは押せない）。
   */
  variant?: "card" | "cell";
  /** 開いているか（v-model:open）。渡さなければ trigger のとおりに開く。 */
  open?: boolean;
  /** hover のとき、乗せてから開くまでの時間（ミリ秒）。cell は既定で 0。 */
  delay?: number;
  /** 吹き出しの幅（px か CSS の長さ）。既定はデザインが決める（remix は 240px）。 */
  width?: number | string;
  /** 開かない。 */
  disabled?: boolean;
  /** 見出しがないときの読み上げ用の名前。 */
  label?: string;
}
export interface ArPopoverEmits {
  "update:open": [open: boolean];
}
export type ArPopoverPart = "trigger" | "root" | "panel" | "arrow" | "title" | "body" | "footer";
