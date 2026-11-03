import type { ArIconName } from "../icons";

/** ボタンの種類。 */
export type ArButtonTone =
  | "primary"
  | "secondary"
  | "subtle"
  | "ghost"
  | "muted"
  | "link"
  | "dashed"
  | "danger"
  | "danger-subtle"
  | "danger-ghost"
  | "danger-fill"
  | "danger-outline";

/** ArButton 1.0 の契約。 */
export interface ArButtonProps {
  /**
   * 種類。
   * primary：そのまとまりで一番大事な操作（1つだけ）。テーマ色で塗る。
   * secondary：やめる・戻る（白地に枠）。
   * subtle：見出しの横の補助の操作（淡いテーマ色の地）。
   * ghost：表の上の小さな操作（テーマ色の文字だけ）。
   * muted：目立たせない操作・アイコンだけのボタン（灰色の文字だけ）。
   * link：文中のリンクのような操作（下線）。
   * dashed：行や項目を足す（点線。block と合わせると表の上の「シフト追加」）。
   * danger：削除（塗り）。確かめの画面で最後に押すときだけ。danger-fill も同じ。
   * danger-subtle：削除（白地に赤い枠）。danger-outline も同じ。
   * danger-ghost：削除（赤い文字だけ）。
   */
  tone?: ArButtonTone;
  /** 大きさ。xs＝表の行の中の小さな操作（「シフトに入れる」）・sm＝小さい・md＝ふつう・lg＝大きい。 */
  size?: "xs" | "sm" | "md" | "lg";
  /** 形。round は両端が丸い、circle は丸（アイコンだけのボタン向け）。 */
  shape?: "default" | "round" | "circle";
  /** 文字の前のアイコン。 */
  icon?: ArIconName;
  /** 文字の後ろのアイコン（メニューを開くボタンの cd など）。 */
  iconEnd?: ArIconName;
  /** アイコンだけのボタンのときの名前（読み上げ・ツールチップ）。default slot が空なら必須。 */
  label?: string;
  /** 読み込み中。回る印を出し、押せなくする。 */
  loading?: boolean;
  /** 押せない。 */
  disabled?: boolean;
  /** 親の幅いっぱい。 */
  block?: boolean;
  /** button の type。 */
  type?: "button" | "submit";
  /** 渡すとリンク（a 要素）として出す。 */
  href?: string;
}
export interface ArButtonEmits {
  click: [event: MouseEvent];
}
export type ArButtonPart = "root" | "icon" | "icon-end" | "label" | "spinner";
