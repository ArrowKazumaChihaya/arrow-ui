/**
 * ArVariablePanel 1.0 の契約。差し込む変数（ARROW の変数・差し込み項目）を探して、押すと入れるパネル。
 * 入れる先（文章の入力・件名の欄など）は製品が決める。押すと insert を出すだけ（ArRichTextEditor の中でも使う）。
 * デザインが選べる形（ArDesign.forms.ArVariablePanel）：
 * - search："on"（既定。searchable のとき探す欄を出す）／"off"（探す欄を出さない。今の ARROW の変数のメニュー（Froala の「ARROWの変数」）には探す欄がない。classic）。
 */

/** 変数1つ。 */
export interface ArVariableItem {
  /** 変数の名前（例："employee_name"）。token を省くと `{{ $employee_name }}` を入れる。 */
  key: string;
  /** 見える名前（例：「社員名」）。 */
  label: string;
  /** 入れる文字（例："{社員:社員名}"）。省くと `{{ $key }}`。 */
  token?: string;
  /** 乗せたときの説明（例：「末永 修也」のような入る値の例）。 */
  description?: string;
  /** 探すときに名前のほかに当てる言葉（例：「入社日」に「入社」「入った日」）。 */
  keywords?: readonly string[];
}

/** 変数のまとまり（会社情報・社員情報・メール固有情報 など）。 */
export interface ArVariableGroup {
  /** まとまりの名前（タブの値）。 */
  key: string;
  /** 見える名前（例：「社員情報」）。 */
  label: string;
  items: readonly ArVariableItem[];
}

export interface ArVariablePanelProps {
  /** 変数のまとまり。 */
  groups: readonly ArVariableGroup[];
  /**
   * 形。
   * list：まとまりの見出しの下に「＋ 名前」の行を並べる縦のパネル（書類集計の自作書類の右の「ARROWの変数」）。
   * chips：上にまとまりのタブと探す欄、下に「＋ 名前」の札を並べる（通知のメールテンプレートの「ARROW 差し込み項目」）。
   */
  layout?: "list" | "chips";
  /** 上の題（list の「ARROWの変数」）。chips では出さない。 */
  title?: string;
  /** 題の下の説明（「押すと、本文のカーソルの位置に入ります。」など）。chips では札の下に出す。 */
  description?: string;
  /** chips の選んでいるまとまり（v-model:tab）。渡さなければ中で持ち、最初のまとまりから始める。 */
  tab?: string;
  /** 探す言葉（v-model:query）。渡さなければ中で持つ。 */
  query?: string;
  /** 探す欄を出す。 */
  searchable?: boolean;
  /** 札・行の入る部分の高さの上限（例："112px"）。越えたらその中だけ巻き取る。 */
  maxHeight?: string;
  /** 押せない。 */
  disabled?: boolean;
  /** 画面の文字。empty の {q} は探した言葉に置き換える。 */
  labels?: {
    /** 探す欄の読み上げの名前。 */
    search: string;
    /** 探す欄の薄い字。 */
    searchPlaceholder: string;
    /** 合う変数がないとき。 */
    empty: string;
    /** まとまりのタブの読み上げの名前。 */
    tabs: string;
    /** 札・行の読み上げ（「{label}を差し込む」）。{label} を変数の名前に置き換える。 */
    insert: string;
  };
}

export interface ArVariablePanelEmits {
  /** 変数を押したとき。token は入れる文字（item.token か `{{ $key }}`）。 */
  insert: [token: string, item: ArVariableItem, group: ArVariableGroup];
  "update:tab": [key: string];
  "update:query": [query: string];
}

export type ArVariablePanelPart =
  | "root"
  | "head"
  | "title"
  | "description"
  | "search"
  | "search-icon"
  | "search-input"
  | "tabs"
  | "tab"
  | "tab-count"
  | "body"
  | "group"
  | "group-label"
  | "item"
  | "item-icon"
  | "item-label"
  | "empty"
  | "note";
