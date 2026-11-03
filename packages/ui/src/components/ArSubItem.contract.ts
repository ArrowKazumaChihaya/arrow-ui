/**
 * ArSubItem 1.0 の契約。項目の中の小さな項目：上に項目名、下に入力。
 * 今の ARROW の SubItem（ui-SubItem）にあたる。ArItem の中や、横に並べて使う。
 */
export interface ArSubItemProps {
  /** 項目名。title スロットでも渡せる。 */
  title?: string;
  /** 必須の印を出す（今の ARROW の isNeed）。 */
  required?: boolean;
  /** 必須の印の文字（読み上げにも使う）。 */
  requiredText?: string;
  /** 項目名を出す（false なら入力だけ。今の ARROW の isShowTitle）。 */
  showTitle?: boolean;
  /** 入力の id（省くと自動）。default スロットの値で入力に渡す。 */
  id?: string;
}
/** default スロットに渡す値。中の入力に v-bind する。 */
export interface ArSubItemControlProps {
  id: string;
  "aria-labelledby"?: string;
  "aria-required"?: "true";
}
export type ArSubItemPart = "root" | "title" | "label" | "required" | "content";
