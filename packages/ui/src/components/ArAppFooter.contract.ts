/** ArAppFooter 1.0 の契約。PC の画面の足（左にリンク、右に問い合わせ）。 */
import type { ArIconName } from "../icons";

export interface ArAppFooterLink {
  key: string;
  label: string;
  /** 開く先（新しいタブ）。無ければ押すと select を出す。 */
  href?: string;
  icon?: ArIconName;
}
export interface ArAppFooterProps {
  /** 左のリンク（ご利用ガイド・利用規約・特定商取引法・操作説明動画・ヘルプ）。 */
  links?: readonly ArAppFooterLink[];
  /** 右の大きめのボタン（問題報告・電話・お問い合わせ）。icon を付ける。 */
  supports?: readonly ArAppFooterLink[];
  /** 下に小さく出す著作権の表示。 */
  copyright?: string;
}
export interface ArAppFooterEmits {
  select: [key: string, event: MouseEvent];
}
export type ArAppFooterPart = "root" | "links" | "link" | "supports" | "support" | "copyright";
