/** ArSelect 1.0 の契約。 */
import type { ArIconName } from "../icons";

export type ArSelectValue = string | number;

export interface ArSelectOption {
  value: ArSelectValue;
  label: string;
  disabled?: boolean;
  /** 頭に出すアイコン（例：store）。 */
  icon?: ArIconName;
  /** 頭に出す丸の文字（人の名前なら頭文字。例：「佐」）。 */
  avatar?: string;
  /** 丸の地の色（人ごとの色）。省くとテーマ色の淡い色。 */
  avatarColor?: string;
  /** 丸の文字の色。 */
  avatarInk?: string;
  /** 右に出す小さな文字（例：「登録済み」「渋谷店」）。 */
  description?: string;
  /** 右の小さな文字の色（例：「希望あり」は ok）。 */
  descriptionTone?: "default" | "ok" | "warn" | "danger";
  /** 探すときに名前と一緒に見る文字（読み・社員コードなど）。 */
  keywords?: string;
}

export interface ArSelectGroup {
  /** まとまりの見出し（例：「東京」）。 */
  label: string;
  options: readonly ArSelectOption[];
}

/** プルダウンの下に出す操作のボタン（「新規作成」など）。 */
export interface ArSelectAction {
  value: string;
  label: string;
  icon?: ArIconName;
}

/**
 * ArSelect 1.0 の契約。
 *
 * デザインが選ぶ形（ArDesign.forms.ArSelect）。値の受け渡しはどの形でも同じ。
 * - `search`：`"auto"`（既定）＝選択肢が7つ以上ならプルダウンに探す欄を出す。`"off"`＝searchable を渡さない限り出さない（今の ARROW）。
 */
export interface ArSelectProps {
  /** 選んでいる値。1つ選ぶときは値か null、multiple のときは値の配列。 */
  modelValue: ArSelectValue | null | readonly ArSelectValue[];
  /** 選択肢。見出しつきのまとまり（{ label, options }）も混ぜられる。 */
  options: readonly (ArSelectOption | ArSelectGroup)[];
  /** 複数選ぶ。選んだものは札で並べ、多いと「+n」にまとめる。 */
  multiple?: boolean;
  /** 札を何枚まで出すか（multiple）。残りは「+n」。 */
  maxTags?: number;
  /**
   * 先頭に「何も選ばない」行を出す（選ぶと null。今の ARROW の Select の「未選択」）。
   * true なら placeholder の文字、文字を渡せばその文字。
   */
  nullOption?: boolean | string;
  /** プルダウンの下に出す操作のボタン（「新規作成」など）。押すと action を出して閉じる。 */
  actions?: readonly ArSelectAction[];
  /** 何も選んでいないときの文字。 */
  placeholder?: string;
  /**
   * 見た目。
   * field：入力と同じ枠（.inp）。
   * selbox：店舗の選択のような、アイコン＋名前＋下向きの印（.selbox）。
   */
  variant?: "field" | "selbox";
  /** 頭に出すアイコン（selbox の store・bld など）。 */
  icon?: ArIconName;
  /** 大きさ。sm＝高さ30・md＝38・lg＝44。 */
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  /** 読み込み中（右の印が回る。開けない）。 */
  loading?: boolean;
  /** 選んでいるとき、右に消すボタンを出す。 */
  clearable?: boolean;
  /** プルダウンに探す欄を出す。省くと選択肢が7つ以上のとき出す。 */
  searchable?: boolean;
  /** 探す欄の薄い文字。 */
  searchPlaceholder?: string;
  /** 合う選択肢がないとき・選択肢が空のときの文字。 */
  emptyText?: string;
  /** 読み込み中の文字。 */
  loadingText?: string;
  /** 幅を中身ではなく親いっぱいにする。 */
  block?: boolean;
  /** プルダウンの高さの上限（px）。省くとデザインの既定（remix 264・classic 256）。 */
  listHeight?: number;
  /** 読み上げの名前（ArField の中では不要）。 */
  label?: string;
  /** 押す所の id（ArField の中ではスロットの id を渡す）。 */
  id?: string;
}

export type ArSelectPart =
  | "root"
  | "icon"
  | "value"
  | "placeholder"
  | "tags"
  | "tag"
  | "tag-remove"
  | "clear"
  | "arrow"
  | "spinner";
