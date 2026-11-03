/** ArTag 1.0 の契約。 */
import type { ArIconName } from "../icons";

export interface ArTagProps {
  /**
   * 意味の色。neutral＝標準・変更なし、accent＝種類（テーマ色の淡い札）、solid＝テーマ色の塗り、
   * ok＝提出済、warn＝未提出・非公開、danger＝エラー・不足、event＝イベント。色だけで伝えず、必ず言葉を入れる。
   */
  tone?: "neutral" | "accent" | "solid" | "ok" | "warn" | "danger" | "event";
  /** 形。square＝角丸7の札（線つき）、pill＝丸い札（線なし・太字。件数「4名」や状態「提出済」）。 */
  shape?: "square" | "pill";
  /** 大きさ。md＝24（pill は22）、sm＝20、xs＝16（カレンダーのマスの「不足1」「提出2」）。 */
  size?: "xs" | "sm" | "md";
  /** 文字の前の線のアイコン。 */
  icon?: ArIconName;
  /** 件数の札（数字を等幅にする）。 */
  count?: boolean;
  /** 右に × を出して外せるようにする（close を出す）。 */
  closable?: boolean;
  /** × の読み上げの名前。 */
  closeLabel?: string;
  /** 点線の「タグを追加」の形（押せる）。 */
  dashed?: boolean;
  /** 選べる札（CheckableTag）。押すと update:checked を出す。 */
  checkable?: boolean;
  /** 選んでいるか（v-model:checked）。checkable のときだけ。 */
  checked?: boolean;
  /** 押せない（checkable・dashed・closable のとき）。 */
  disabled?: boolean;
}

export interface ArTagEmits {
  close: [event: MouseEvent];
  "update:checked": [checked: boolean];
  click: [event: MouseEvent];
}

export type ArTagPart = "root" | "icon" | "label" | "close";
