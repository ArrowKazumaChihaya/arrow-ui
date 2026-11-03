import type { ArIconName } from "../icons";

/** ArButton 1.0 の契約。 */
export interface ArButtonProps {
  /** primary：そのまとまりで一番大事な操作（1つだけ）。secondary：やめる・戻る。subtle：補助。ghost：文字だけ。
   *  danger：削除（塗り）。danger-subtle：削除（枠）。dashed：行や項目を足す。 */
  tone?: "primary" | "secondary" | "subtle" | "ghost" | "danger" | "danger-subtle" | "dashed";
  size?: "sm" | "md" | "lg";
  icon?: ArIconName;
  /** アイコンだけのボタンのときの名前（読み上げ・ツールチップ）。default slot が空なら必須。 */
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  /** 親の幅いっぱい。 */
  block?: boolean;
  type?: "button" | "submit";
}
export interface ArButtonEmits {
  click: [event: MouseEvent];
}
export type ArButtonPart = "root" | "icon" | "label" | "spinner";
