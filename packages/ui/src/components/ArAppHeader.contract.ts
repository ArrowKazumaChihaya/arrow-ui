/** ArAppHeader 1.1 の契約。PC の画面の頭（2段：ロゴ・お知らせ・やること・管理ページ／メニュー）。 */
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
  /**
   * 子のメニュー（社員情報 → 社員一覧・有給管理）。ヘッダーでは項目の真下に同じ幅で、下のメニュー（ArBottomNav）ではメニューの上の1段に出す。
   * 開き方：指す・フォーカスする・指で押す（押すと navigate も出す）・↓ キー（最初の子へ移る）。↑↓ で移り、Escape で閉じて項目へ戻る。
   * 選ぶと navigate に子の key。
   */
  children?: readonly ArAppNavItem[];
  /** 名前に小さく添える文字（領域のタブの「未契約」「無効」など。今の ARROW の small）。 */
  note?: string;
}

/** ピルの一覧の1行（お知らせの題・やることの中身）。 */
export interface ArAppHeaderPillItem {
  key: string;
  label: string;
  /** 右に × を出し、押すと pill-item-delete を出す（やることを一覧から外す。今の todo_delete）。 */
  deletable?: boolean;
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
  /**
   * ピルの一覧（お知らせの題・やることの中身）。渡すと、指す・フォーカスする・押す・↓ キーでピルの下に一覧が出る
   * （押して開いたときは外を押すか Escape まで出したまま）。行を押すと pill-item。多いと一覧の中でスクロールする。
   */
  items?: readonly ArAppHeaderPillItem[];
  /** 一覧から外した数。1以上なら一覧の下に「すべて表示する」を出し、押すと pill-restore（今の todo_cancel_item）。 */
  hiddenCount?: number;
  /** items が空のときに一覧に出す文字（「やることはありません」）。省くと空のときは一覧を出さない。 */
  emptyText?: string;
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
  /**
   * 文字。delete＝やることの × の読み上げ（「削除」）、restore＝「すべて表示する」。
   */
  labels?: { nav: string; count: string; collapse?: string; expand?: string; domains?: string; delete?: string; restore?: string };
}
export interface ArAppHeaderEmits {
  navigate: [key: string, event: MouseEvent];
  /** 領域のタブを押した。 */
  domain: [key: string];
  "update:collapsed": [collapsed: boolean];
  /** ピルの一覧の項目を押した。 */
  "pill-item": [pill: string, item: string];
  /** 一覧の行の × を押した（やることを外す。製品が保存して items と hiddenCount を変える）。 */
  "pill-item-delete": [pill: string, item: string];
  /** 「すべて表示する」を押した（外したものを戻す）。 */
  "pill-restore": [pill: string];
  /** ピルを押した（一覧を開け閉めするのと一緒に出す）。 */
  pill: [key: string];
  account: [key: string];
}
/**
 * slot：logo（ロゴの絵。製品が渡す）、top（1段目のピルの右に置くもの。「デザインを選択」など）。
 * 業務の切り替え（人事・経費）は domains／domain／@domain、ヘッダーを閉じるは collapsible／v-model:collapsed、
 * デザインの選択は #top に置く（ヘッダーの下に別の1行を置かなくてよい）。
 */
export type ArAppHeaderPart = "root" | "top" | "logo" | "pill" | "count" | "account" | "avatar" | "nav" | "item" | "spacer" | "account-menu" | "pill-list" | "pill-item" | "top-extra" | "domains" | "domain" | "toggle" | "expand" | "submenu" | "submenu-item" | "pill-rows" | "pill-row" | "pill-delete" | "pill-empty" | "pill-restore" | "domain-note";
