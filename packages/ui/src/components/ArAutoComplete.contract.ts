/** ArAutoComplete 1.0 の契約。 */
import type { ArIconName } from "../icons";

export interface ArAutoCompleteOption {
  /** 選んだときに select で渡す値。 */
  value: string | number;
  /** 出す名前。選ぶと入力にこの文字が入る。 */
  label: string;
  /** 丸の文字（省くと avatar が true のとき名前の頭文字）。 */
  avatar?: string;
  avatarColor?: string;
  avatarInk?: string;
  /** 右に出す小さな文字（例：「渋谷店」）。 */
  description?: string;
  /** 読み（例：「さとう だいち」）。名前と同じく空白で区切ると、読みで合ったとき名前の同じ語を強める。社員コードなども入れられる。 */
  keywords?: string;
  disabled?: boolean;
}

export interface ArAutoCompleteProps {
  /** 入っている文字。v-model で受け渡す。 */
  modelValue: string;
  /** 候補。文字だけの配列でもよい。 */
  options: readonly (ArAutoCompleteOption | string)[];
  placeholder?: string;
  /** 候補の先頭に「リセット」の行を出す（選ぶと入力を空にする。今の ARROW の Candidate）。true なら「リセット」、文字を渡せばその文字。 */
  resetOption?: boolean | string;
  /** 入力の頭のアイコン（例：search）。 */
  icon?: ArIconName;
  /** 候補に頭文字の丸を出す（名前の選択）。 */
  avatar?: boolean;
  /** 打った文字で候補を絞る。false にすると options をそのまま出す（サーバーで探すとき）。 */
  filter?: boolean;
  /** 候補を出し始める文字数。 */
  minChars?: number;
  /** 合う候補がないときの文字（省くとプルダウンを出さない）。 */
  emptyText?: string;
  /** 大きさ。sm＝高さ30・md＝38・lg＝44。 */
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  /** 幅を親いっぱいにする。 */
  block?: boolean;
  /** 読み上げの名前（ArField の中では不要）。 */
  label?: string;
  /** input の id（ArField の中ではスロットの id を渡す）。 */
  id?: string;
}

export type ArAutoCompletePart = "root";
