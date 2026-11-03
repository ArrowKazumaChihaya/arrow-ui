/** ArMobileHeader 1.0 の契約。スマホの画面の頭（ロゴとお知らせのベル）。 */
import type { ArIconName } from "../icons";

export interface ArMobileHeaderProps {
  /** お知らせの件数。1以上なら赤い丸で出す。 */
  count?: number;
  /** ベルのボタンの名前（読み上げ・ツールチップ。「システムからのお知らせ」）。 */
  noticeLabel?: string;
  /** ベルのアイコン。既定は speaker。 */
  icon?: ArIconName;
  /** ベルを出さない。 */
  hideNotice?: boolean;
  labels?: { count: string };
}
export interface ArMobileHeaderEmits {
  notice: [];
}
/** slot：logo（ロゴの絵）、actions（ベルの左に足すボタン）。 */
export type ArMobileHeaderPart = "root" | "logo" | "actions" | "notice" | "count";
