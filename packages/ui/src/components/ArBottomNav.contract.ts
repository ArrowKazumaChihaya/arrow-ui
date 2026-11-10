/** ArBottomNav 1.1 の契約。スマホの下に固定するメニュー（5つ）。子のメニューと「メニュー（その他）」の一覧を持つ。 */
import type { ArIconName } from "../icons";
import type { ArAppNavItem } from "./ArAppHeader.contract";

export interface ArBottomNavProps {
  /**
   * 項目（シフト・勤怠・給与賞与報酬年調・書類集計…）。max より多いと、max-1 個を並べ、残りは右端の「メニュー」から下に出る一覧に入れる。
   * 項目の children は、押すとメニューの上に1段で出す（今の ARROW のスマホのフッターの sub_menu）。
   */
  items: readonly ArAppNavItem[];
  /** 今いる項目の key（子の key でもよい。子なら親も今いる印にする）。 */
  current?: string;
  /** 並べる数（既定 5）。 */
  max?: number;
  /**
   * 右端の「メニュー」の項目を出す。true で items があふれたときだけ（既定）、"always" でいつも、false で出さない。
   * 押すと more を出し、moreSheet が true なら残りの項目（always のときは全部）を下から出る一覧（ArDrawer placement="bottom"）で出す。
   */
  more?: boolean | "always";
  /** 「メニュー」を押したときに下から一覧を出す（既定 true）。false なら more だけを出す（製品がメニューのページへ移るとき）。 */
  moreSheet?: boolean;
  /** 「メニュー」のアイコン（既定 menu）。 */
  moreIcon?: ArIconName;
  /** 下から出る一覧が開いているか（v-model:moreOpen。渡さなければ中で持つ）。 */
  moreOpen?: boolean;
  /** 画面の下に固定する（既定）。false なら置いた場所に出す（説明の見本など）。 */
  fixed?: boolean;
  /** nav＝読み上げの名前、more＝「メニュー」の文字（一覧の題にも使う）、sub＝子のメニューの読み上げ。 */
  labels?: { nav: string; more?: string; sub?: string };
}
export interface ArBottomNavEmits {
  /** 項目・子の項目・一覧の項目を押した。子のある項目を押したときも出す（今の ARROW と同じく、移りながら子の段を出す）。 */
  navigate: [key: string, event: MouseEvent];
  /** 「メニュー」を押した。 */
  more: [];
  "update:moreOpen": [open: boolean];
}
/** 一覧の中身は data-ar="nav-sheet"（tile・tile-icon・tile-label。子は data-kind="child"）。 */
export type ArBottomNavPart = "root" | "item" | "icon" | "label" | "submenu" | "submenu-item" | "submenu-icon" | "submenu-text" | "submenu-desc" | "submenu-arrow";
