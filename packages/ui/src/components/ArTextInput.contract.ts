/**
 * ArTextInput 1.1 の契約。
 *
 * 属性の行き先：class と style は外側の箱（data-part="root"。幅・余白を決める所）に付ける。
 * それ以外の属性とイベント（tabindex・aria-*・data-*・inputmode・maxlength・enterkeyhint・pattern、
 * @keydown・@beforeinput・@paste・@drop・@compositionend など）はすべて中の input に渡す。
 * 中の input に class・style を付けたいとき（今の ARROW の tabindexkey のように input を class で探すとき）は inputClass・inputStyle を使う。
 * change と focus・blur は部品のイベント（change は文字、focus・blur は FocusEvent）。打つたびの値は update:modelValue。
 * フォーカスは ref から focus()・blur()・select()・setSelectionRange()、中の要素は input で取れる。
 * input のイベントで値を直した（マスク・数字だけ）ときも、出した値と入力欄の文字をそろえる（同じ値を出しても欄が直る）。
 */
import type { ArIconName } from "../icons";

export interface ArTextInputProps {
  /** 入っている文字。v-model で受け渡す。 */
  modelValue: string;
  /**
   * 入力の種類。
   * search：頭に虫めがね（icon を渡さないとき）。Enter で search を出す。
   * password：右に目のボタン（押すと文字を見せる・隠す）。
   */
  type?: "text" | "search" | "password" | "tel" | "email" | "url";
  /** 何も入っていないときの薄い文字。 */
  placeholder?: string;
  /** 大きさ。sm＝高さ30・md＝38・lg＝44。 */
  size?: "sm" | "md" | "lg";
  /** 見え方。outlined＝白地に枠（ふつう）。filled＝枠なしの灰色の地。 */
  variant?: "outlined" | "filled";
  /** 間違いの枠（赤）。ArField の中では自動で付く。 */
  invalid?: boolean;
  /** 注意の枠（黄）。間違いではないが確かめてほしいとき。 */
  warning?: boolean;
  disabled?: boolean;
  /** 読み取りのみ（選んでコピーはできる）。 */
  readonly?: boolean;
  /** 入力の頭に出すアイコン（例：search・user・lock）。 */
  icon?: ArIconName;
  /** 入力の頭に出す文字（例：「¥」「https://」）。 */
  prefix?: string;
  /** 箱の左に区切って付ける文字（例：「https://」）。淡い灰色の地。 */
  addonBefore?: string;
  /** 箱の右に区切って付ける文字（例：「.jp」）。 */
  addonAfter?: string;
  /** 入力の後ろに出す単位などの文字（例：「円」「分」）。 */
  suffix?: string;
  /** 入力の後ろに出すアイコン（例：info）。 */
  suffixIcon?: ArIconName;
  /** 文字があるとき、右に消すボタンを出す。 */
  clearable?: boolean;
  /** 右に文字数を出す（maxlength があれば「3 / 20」）。 */
  showCount?: boolean;
  /** 入れられる文字数の上限。 */
  maxlength?: number;
  /** 幅を親いっぱいにする。 */
  block?: boolean;
  /** 文字の寄せ。数・金額は right（今の ARROW では style で右寄せにしている所）。 */
  align?: "left" | "center" | "right";
  /** 読み上げの名前（ArField の中では不要）。 */
  label?: string;
  /** input の id（ArField の中ではスロットの id を渡す）。 */
  id?: string;
  /** 入力の名前（フォームで送るとき）。 */
  name?: string;
  inputmode?: "text" | "numeric" | "decimal" | "tel" | "email" | "search" | "url";
  autocomplete?: string;
  /** 出たときに入力へフォーカスする。 */
  autofocus?: boolean;
  /** 消すボタンの読み上げ。 */
  clearLabel?: string;
  /** 中の input に付ける class（今の ARROW の text_input・tabindexkey など、input を class で探すとき）。 */
  inputClass?: string | readonly string[] | Record<string, boolean>;
  /** 中の input に付ける style。 */
  inputStyle?: string | Record<string, string | number>;
}

export type ArTextInputPart = "root" | "addon" | "prefix" | "input" | "suffix" | "clear" | "reveal" | "count";
