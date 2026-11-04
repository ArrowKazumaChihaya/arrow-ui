/** ArMobileHeader 1.1 の契約。スマホの画面の頭（ロゴとお知らせのベル。メニューを渡すと右端にメニューのボタン）。 */
import type { ArIconName } from "../icons";
import type { ArAppNavItem } from "./ArAppHeader.contract";

export interface ArMobileHeaderProps {
  /** お知らせの件数。1以上なら赤い丸で出す。 */
  count?: number;
  /** ベルのボタンの名前（読み上げ・ツールチップ。「システムからのお知らせ」）。 */
  noticeLabel?: string;
  /** ベルのアイコン。既定は speaker。 */
  icon?: ArIconName;
  /** ベルを出さない。 */
  hideNotice?: boolean;
  /**
   * メニュー（ArAppHeader の menus・menusEnd と同じ形）。渡すと右端にメニューのボタンを出し、押すと下から一覧（ArDrawer placement="bottom"）を出す。
   * 一覧は親の項目とその子（children）を順に並べる（今の ARROW のメニューのページと同じ）。押すと navigate。
   */
  menus?: readonly ArAppNavItem[];
  /** 今いる項目の key（一覧で印を付ける）。 */
  current?: string;
  /** 一覧が開いているか（v-model:menuOpen。渡さなければ中で持つ）。 */
  menuOpen?: boolean;
  /** count＝件数の単位、menu＝メニューのボタンと一覧の題。 */
  labels?: { count: string; menu?: string };
}
export interface ArMobileHeaderEmits {
  notice: [];
  /** 一覧の項目を押した。 */
  navigate: [key: string, event: MouseEvent];
  "update:menuOpen": [open: boolean];
}
/** slot：logo（ロゴの絵）、actions（ベルの左に足すボタン。やることの札など）。一覧の中身は data-ar="nav-sheet"。 */
export type ArMobileHeaderPart = "root" | "logo" | "actions" | "notice" | "count" | "menu";
