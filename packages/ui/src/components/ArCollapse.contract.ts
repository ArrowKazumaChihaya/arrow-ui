/** ArCollapse 1.1 の契約。 */
import type { ArIconName } from "../icons";

export interface ArCollapseItem {
  /** 項目を見分ける値（slot の名前 panel-<key> にも使う）。 */
  key: string;
  /** 見出し（#title-<key>・#title で部品に差し替えられる。そのときも読み上げの名前に使う）。 */
  title: string;
  /** 見出しの前のアイコン。 */
  icon?: ArIconName;
  /** 見出しの右の補足（「出勤中 4名」）。#extra-<key> で差し替えられる。 */
  extra?: string;
  /** 開けない。 */
  disabled?: boolean;
}

export interface ArCollapseProps {
  /** 項目。 */
  items: readonly ArCollapseItem[];
  /** 開いている項目の key（v-model）。 */
  modelValue?: readonly string[];
  /** 1つだけ開く（ほかを開くと前のが閉じる）。 */
  accordion?: boolean;
  /** 枠と見出しの地をなくす（カードの中で使う）。 */
  ghost?: boolean;
  /** 見出しの段階（読み上げ）。 */
  headingLevel?: 2 | 3 | 4 | 5;
}

export interface ArCollapseEmits {
  "update:modelValue": [keys: string[]];
}

/**
 * slot：panel-<key>（中身）・panel（{ item }：共通の中身）・extra-<key>（見出しの右の文字）、
 * 1.1：title-<key>・title（{ item, open }：見出しの文字の所に部品。押すと開閉する。今の UI/Collapse の #header）、
 * header-extra-<key>・header-extra（{ item, open }：見出しのボタンの外の右。押しても開閉しない。ボタン・スイッチなど押せる部品はここに置く）。
 * 1つだけの折りたたみ（今の UI/Collapse：value の true／false）は items を1つにし、v-model を [key] か [] にする。
 */
export type ArCollapsePart = "root" | "panel" | "header" | "trigger" | "arrow" | "icon" | "title" | "extra" | "body" | "header-extra";
