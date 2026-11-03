/** ArMentions 1.0 の契約。 */
export interface ArMentionsOption {
  /** 選んだときに select で渡す値（社員 ID など）。 */
  value: string | number;
  /** 名前。選ぶと「@名前 」が入る。 */
  label: string;
  /** 丸の文字（省くと名前の頭文字）。 */
  avatar?: string;
  avatarColor?: string;
  avatarInk?: string;
  /** 右に出す小さな文字（例：店舗）。 */
  description?: string;
  /** 読み・社員コードなど（探すときに見る）。 */
  keywords?: string;
}

export interface ArMentionsProps {
  /** 入っている文字。v-model で受け渡す。 */
  modelValue: string;
  /** 呼べる人。 */
  options: readonly (ArMentionsOption | string)[];
  /** 呼ぶときの頭の文字。 */
  prefix?: string;
  placeholder?: string;
  /** はじめの行数（高さは少なくとも56px）。 */
  rows?: number;
  /** 打った量に合わせて伸びる上限の行数（超えたら中でスクロール）。 */
  maxRows?: number;
  /** 候補に頭文字の丸を出す。 */
  avatar?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  /** 合う人がいないときの文字（省くとプルダウンを出さない）。 */
  emptyText?: string;
  /** 読み上げの名前（ArField の中では不要）。 */
  label?: string;
  /** textarea の id（ArField の中ではスロットの id を渡す）。 */
  id?: string;
}

export type ArMentionsPart = "root" | "mirror" | "mention" | "caret" | "input";
