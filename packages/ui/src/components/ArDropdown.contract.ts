/** ArDropdown 1.0 の契約。 */
import type { ArIconName } from "../icons";
import type { ArMenuItem } from "./ArMenu.contract";
import type { ArButtonTone } from "./ArButton.contract";

export interface ArDropdownProps {
  /** メニューの項目（ArMenu と同じ形。group の見出し・divider の区切り・description の説明・danger・disabled・locked）。 */
  items: readonly ArMenuItem[];
  /** 開いているか。v-model:open（渡さなければ中で持つ）。 */
  open?: boolean;
  /** default slot を使わないときの、押すボタンの文字。 */
  label?: string;
  /** 押すボタンの頭のアイコン。 */
  icon?: ArIconName;
  /**
   * default slot を使わないときの押すボタンの形。
   * ops：シフト画面の「操作」ボタン（テーマ色・右に区切り線と cd）。
   * button：ArButton（右に cd）。split：Dropdown.Button（左が操作、右の cd でメニュー。Compact でつなぐ）。
   */
  variant?: "ops" | "button" | "split";
  /** variant が button・split のときのボタンの種類。 */
  tone?: ArButtonTone;
  /** ボタンの大きさ（button・split）。 */
  size?: "sm" | "md" | "lg";
  /** メニューを出す向き。 */
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  /** メニューの幅（px）。渡さなければ中身に合わせる（少なくとも押すボタンの幅）。 */
  width?: number;
  /** 押せない。 */
  disabled?: boolean;
  /** 選んだら閉じる。 */
  closeOnSelect?: boolean;
  /** split の右のボタンの読み上げの名前。 */
  moreLabel?: string;
}
export interface ArDropdownEmits {
  "update:open": [open: boolean];
  /** 項目を選んだ。 */
  select: [key: string, item: ArMenuItem];
  /** split の左のボタンを押した。 */
  click: [event: MouseEvent];
}
/** default slot（押すもの）は { open, toggle, attrs } を受け取る。attrs を押す要素に v-bind すると aria が付く。 */
export type ArDropdownPart = "root" | "trigger" | "icon" | "label" | "caret" | "list" | "group" | "item" | "icon-box" | "text" | "description" | "divider";
