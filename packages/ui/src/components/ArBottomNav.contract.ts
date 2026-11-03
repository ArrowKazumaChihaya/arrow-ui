/** ArBottomNav 1.0 の契約。スマホの下に固定するメニュー（5つ）。 */
import type { ArAppNavItem } from "./ArAppHeader.contract";

export interface ArBottomNavProps {
  /** 項目（シフト・勤怠・給与賞与報酬年調・書類集計・メニュー）。5つまで。 */
  items: readonly ArAppNavItem[];
  /** 今いる項目の key。 */
  current?: string;
  /** 画面の下に固定する（既定）。false なら置いた場所に出す（説明の見本など）。 */
  fixed?: boolean;
  labels?: { nav: string };
}
export interface ArBottomNavEmits {
  navigate: [key: string, event: MouseEvent];
}
export type ArBottomNavPart = "root" | "item" | "icon" | "label";
