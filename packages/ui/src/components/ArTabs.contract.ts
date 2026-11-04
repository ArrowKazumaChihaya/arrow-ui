/** ArTabs 1.1 の契約。 */
import type { ArIconName } from "../icons";

export interface ArTabItem {
  /** タブを見分ける値（v-model に入る）。 */
  key: string;
  /** タブの文字。 */
  label: string;
  /** 文字の前のアイコン。 */
  icon?: ArIconName;
  /** 件数の札。 */
  count?: number;
  /** 押せないタブ。 */
  disabled?: boolean;
  /** 文字の右に「!」の注意の印を出す（確かめてほしいことがあるタブ。今の Tab の isExclamation）。 */
  alert?: boolean;
  /** 閉じる×を出す（variant="card" のとき）。Delete キーでも閉じられる。 */
  closable?: boolean;
}

export interface ArTabsProps {
  /** 選んでいるタブの key。 */
  modelValue: string;
  /** タブの並び。 */
  items: readonly ArTabItem[];
  /**
   * 形。band：カードの頭（帯）に置くテーマ色のタブ（画面の切り替え）。
   * line：カードの中の下線のタブ（中身の切り替え）。card：閉じられる・足せるタブ（10月分・11月分など）。
   */
  variant?: "band" | "line" | "card";
  /** 大きさ。sm はスマホのカードの帯の中（シフトのキャンバスの .nrw .v-tab：高さ34・13px）。 */
  size?: "md" | "sm";
  /** 読み上げ用の名前。 */
  label: string;
  /** 1つ1つのタブの id の頭（tabpanel 側の aria-labelledby に使う）。 */
  idPrefix?: string;
  /** 最後に「＋」（足す）のボタンを出す（variant="card" のとき）。押すと add。 */
  addable?: boolean;
  /** 「＋」のボタンの読み上げの名前。 */
  addLabel?: string;
  /** 注意の印（alert）の読み上げの名前。 */
  alertLabel?: string;
}

export interface ArTabsEmits {
  "update:modelValue": [key: string];
  /** 閉じる×か Delete キーで閉じようとした。消すかは使う側が決める。 */
  close: [key: string];
  /** 「＋」を押した。 */
  add: [];
}
export type ArTabsPart = "root" | "list" | "tab" | "icon" | "label" | "count" | "alert" | "close" | "add";
