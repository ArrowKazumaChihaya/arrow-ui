/** ArViewOptions 1.0 の契約。表示内容の選択（表やカレンダーに出すものをチェックで選ぶプルダウン。ボタンに「6/7」）。 */
import type { ArIconName } from "../icons";

/** 項目の右に出す、画面での見え方の見本（凡例）。色は画面の見た目に合わせて製品が渡す。 */
export interface ArViewOptionSample {
  /** 見本の文字（「不足1」「● 朝礼」「4名」）。 */
  text?: string;
  /** 見本のアイコン（ロック中の lock・非公開の eyeoff）。 */
  icon?: ArIconName;
  /** 地（色か、斜線などの background の値）。 */
  background?: string;
  /** 文字とアイコンの色。 */
  color?: string;
  /** 枠（box-shadow の値。「inset 0 0 0 1px #E6EBF0」など）。 */
  ring?: string;
}

export interface ArViewOption {
  /** 選んだときに v-model に入る値。 */
  key: string;
  /** 太字の名前（「不足」）。 */
  label: string;
  /** 下の1行の説明（「下の行：募集人数に足りない人数」）。 */
  description?: string;
  /** 右の見本。 */
  sample?: ArViewOptionSample;
  /** 選べない（いつも出すものなど）。 */
  disabled?: boolean;
}

export interface ArViewOptionGroup {
  /** まとまりの見出し（「店舗・日ごと（人数・不足・イベント）」）。省くと見出しなし。 */
  label?: string;
  options: readonly ArViewOption[];
}

export interface ArViewOptionsProps {
  /** 出すものの key の並び（v-model）。 */
  modelValue: readonly string[];
  /** 選べるもの（見出しごとのまとまり）。 */
  groups: readonly ArViewOptionGroup[];
  /** ボタンの文字（「表示内容」「カレンダーに表示」）。 */
  label?: string;
  /** プルダウンの上の見出し（「テーブルに出すもの」）。 */
  title?: string;
  /** 開いているか（v-model:open。渡さなければ中で持つ）。 */
  open?: boolean;
  /** 出す向き。表の下に置くときは top-start（上に開く）。 */
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  /** プルダウンの幅（px）。 */
  width?: number;
  disabled?: boolean;
  /** 下の2つのボタンの文字。 */
  labels?: { all: string; close: string };
}
export interface ArViewOptionsEmits {
  "update:modelValue": [keys: string[]];
  "update:open": [open: boolean];
}
export type ArViewOptionsPart =
  | "root"
  | "trigger"
  | "icon"
  | "label"
  | "count"
  | "caret"
  | "panel"
  | "title"
  | "group"
  | "group-title"
  | "option"
  | "box"
  | "text"
  | "description"
  | "sample"
  | "foot";
