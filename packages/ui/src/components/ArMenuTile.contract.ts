/** ArMenuTile 1.0 の契約。メニュー画面のタイル（テーマ色の四角に線のアイコン、下に名前、右上に件数）。 */
import type { ArPaletteName } from "@s_and_a/arrow-ui-tokens";
import type { ArIconName } from "../icons";

export interface ArMenuTileProps {
  /** 名前（「シフト」「勤怠」など）。四角の下に出す。 */
  label: string;
  /** 四角の中のアイコン。classic は今の ARROW のメニューの絵（白い地に灰色の線）を描く。 */
  icon: ArIconName;
  /** 四角の色（テーマ色の組）。省くと外の ArThemeScope の色。シフト＝blue・勤怠＝green・給与＝yellow・書類＝pink・通知＝orange・会社情報など＝teal。 */
  palette?: ArPaletteName;
  /** 右上の件数（やること・未読の数）。0・空なら出さない。100 以上は「99+」。「!」などの文字も渡せる。 */
  count?: number | string;
  /** 名前の下の赤い一言（「12月分 未提出」「エラー 2日」）。件数の理由を書く。 */
  note?: string;
  /**
   * 形（remix）。card＝白い札の中に四角（共通のメニュー・管理者）。plain＝札なしで四角だけ（マイページのメニュー。四角はテーマ色の濃淡）。
   * classic はどちらも今の ARROW のタイル（角丸10の四角と下の小さな名前）。
   */
  variant?: "card" | "plain";
  /** 大きさ。md＝四角60（PC）。sm＝四角54（スマホ）。 */
  size?: "md" | "sm";
  /** 行き先。渡すと a（リンク）になる。省くと button。 */
  href?: string;
  /** 押せない（契約していない機能など）。 */
  disabled?: boolean;
}
export interface ArMenuTileEmits {
  click: [event: MouseEvent];
}
export type ArMenuTilePart = "root" | "icon" | "count" | "label" | "note";
