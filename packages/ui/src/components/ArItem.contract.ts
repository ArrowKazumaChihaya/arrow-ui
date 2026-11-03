/**
 * ArItem 1.0 の契約。設定の画面などの「項目の1行」：左に項目名（幅 titleWidth）、右に入力と補足。
 * 今の ARROW の Item（ui-Item）にあたる。
 */
export interface ArItemProps {
  /** 項目名。改行（\n）はそのまま改行する。title スロットでも渡せる。 */
  title?: string;
  /** 必須の印を出す（今の ARROW の isNeed）。 */
  required?: boolean;
  /** 必須の印の文字（読み上げにも使う）。 */
  requiredText?: string;
  /** 入力の下に出す補足の文字（info スロットでも渡せる）。 */
  info?: string;
  /** 補足の後ろに「詳細」を出す。押すと detail を出す（説明のポップアップを開くなど）。 */
  detail?: boolean;
  /** 「詳細」をリンクにする（別のページの説明へ）。 */
  detailHref?: string;
  /** 「詳細」の文字。 */
  detailText?: string;
  /** 項目名の幅（CSS の長さ）。 */
  titleWidth?: string;
  /** 入力の id（省くと自動）。default スロットの値で入力に渡す。 */
  id?: string;
}
export interface ArItemEmits {
  /** 「詳細」を押した。 */
  detail: [event: MouseEvent];
}
/** default スロットに渡す値。中の入力に v-bind する。 */
export interface ArItemControlProps {
  id: string;
  "aria-labelledby": string;
  "aria-describedby"?: string;
  "aria-required"?: "true";
}
export type ArItemPart = "root" | "title" | "label" | "required" | "content" | "info" | "info-text" | "detail";
