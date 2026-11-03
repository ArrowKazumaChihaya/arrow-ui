/** ArAppHeader 1.0 の契約。PC の画面の頭（2段：ロゴ・お知らせ・やること・管理ページ／メニュー）。 */
import type { ArIconName } from "../icons";
import type { ArPaletteName } from "@arrow/ui-tokens";

/** メニューの1項目（ヘッダー・スマホの下のメニューで共通）。 */
export interface ArAppNavItem {
  /** 選ばれたときに navigate で返す名前。current と比べる。 */
  key: string;
  label: string;
  icon?: ArIconName;
  /** 開く先。あれば <a href>（新しいタブで開けるように）。無ければ押すと navigate だけを出す。 */
  href?: string;
  /** この項目のテーマ色（classic では指したときにこの色で塗る。シフト＝blue・勤怠＝green…）。 */
  palette?: ArPaletteName;
  /** 指す・フォーカスすると項目の真下に同じ幅で出す子のメニュー（社員情報 → 社員一覧・有給管理）。選ぶと navigate に子の key。 */
  children?: readonly ArAppNavItem[];
}

/** 1段目のピル（「システムからのお知らせ」「やることリスト」）。 */
export interface ArAppHeaderPill {
  key: string;
  label: string;
  /** 件数。1以上なら赤い丸で出す。 */
  count?: number;
  icon?: ArIconName;
  /** notice：灰色（お知らせ）。todo：淡い赤（やること）。 */
  tone?: "notice" | "todo";
  /** 指す・フォーカスするとピルが下に伸びて出す一覧（お知らせの題・やることの中身）。押すと pill-item。 */
  items?: readonly { key: string; label: string }[];
}

/** 管理ページのメニューの1行（契約状況・個人ページへ・ログアウトなど）。 */
export interface ArAppAccountAction {
  key: string;
  label: string;
}

export interface ArAppHeaderProps {
  /** 2段目の左のメニュー（シフト・勤怠・給与賞与報酬年調・書類集計・通知）。 */
  menus: readonly ArAppNavItem[];
  /** 2段目の右のメニュー（会社情報・社員情報・設定）。 */
  menusEnd?: readonly ArAppNavItem[];
  /** 今いるメニューの key。テーマ色で塗る（aria-current="page"）。 */
  current?: string;
  pills?: readonly ArAppHeaderPill[];
  /** 右上の名前（「管理ページ」）と丸の頭文字（「管」）。 */
  account?: { label: string; initial?: string };
  /** 右上を押したときに開くメニュー。無ければ押すと account を key "" で出す。 */
  accountMenu?: readonly ArAppAccountAction[];
  /** メニューの上の領域のタブ（「人事・労務」「経費精算」）。渡すと1段目とメニューの間に並べる。 */
  domains?: readonly ArAppNavItem[];
  /** 今の領域の key（domains のどれか）。 */
  domain?: string;
  /** 領域のタブの段を畳めるようにする（右に「ヘッダーを閉じる」、畳むと右上に「＋」）。 */
  collapsible?: boolean;
  /** 畳んでいるか（v-model:collapsed）。 */
  collapsed?: boolean;
  labels?: { nav: string; count: string; collapse?: string; expand?: string; domains?: string };
}
export interface ArAppHeaderEmits {
  navigate: [key: string, event: MouseEvent];
  /** 領域のタブを押した。 */
  domain: [key: string];
  "update:collapsed": [collapsed: boolean];
  /** ピルの一覧の項目を押した。 */
  "pill-item": [pill: string, item: string];
  pill: [key: string];
  account: [key: string];
}
/** slot：logo（ロゴの絵。製品が渡す）、top（1段目のピルの右に置くもの。「デザインを選択」など）。 */
export type ArAppHeaderPart = "root" | "top" | "logo" | "pill" | "count" | "account" | "avatar" | "nav" | "item" | "spacer" | "account-menu" | "pill-list" | "pill-item" | "top-extra" | "domains" | "domain" | "toggle" | "expand" | "submenu" | "submenu-item";
