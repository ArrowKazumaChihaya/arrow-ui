import type { ArVariableGroup } from "./ArVariablePanel.contract";

/**
 * ArRichTextEditor 1.0 の契約。書式のツールバー・変数のメニュー・文字数のある文章の入力（書類集計の自作書類・通知のメールテンプレート）。
 * 依存を増やさず contenteditable で作る。値は HTML（v-model）。危ないタグ（script・iframe・style・form など）と属性（on…・javascript: の URL）は、入るときも出すときも消す。
 * 変数（`{{ $employee_name }}` など）は本文の中で札のように見せる（v-model の値はただの文字のまま）。
 * デザインが選べる形（ArDesign.forms.ArRichTextEditor）：
 * - variables："inline"（既定。「ARROWの変数」を押すとツールバーの下に ArVariablePanel の chips を開く。通知キャンバスの「ARROW 差し込み項目」）／
 *   "menu"（押すと浮かぶメニューにまとまりを並べ、まとまりを押すとその変数の一覧。今の ARROW の Froala の「ARROWの変数」。classic）。variablesPlacement で上書きできる。
 * - icons："line"（既定。ライブラリの線のアイコン）／"froala"（今の ARROW の Froala の塗りのアイコンと、変数のボタンは ARROW の印。classic）。
 * - variableButton："label"（既定。「ARROWの変数 ∨」の文字のボタン）／"icon"（ARROW の印だけのボタン。classic）。
 * - count："auto"（既定。countPlacement のとおり）／"footer"（いつも下の段。今の ARROW の Froala は文字数をいつも下の段の右に出す。classic）。
 */
export type ArRichTextTool =
  | "variables"
  | "fontSize"
  | "bold"
  | "italic"
  | "underline"
  | "color"
  | "align"
  | "paragraph"
  | "list"
  | "table"
  | "pageBreak"
  | "undo"
  | "redo"
  | "help"
  | "|"
  | "spacer";

export interface ArRichTextEditorProps {
  /** 本文の HTML（v-model）。plain のときは文字と `<br>` だけ。 */
  modelValue?: string;
  /**
   * ツールバーに並べる道具（左から）。"|" は区切り。
   * "spacer" は区切りと同じ。デザインによっては、以降を右に寄せる（classic：今の ARROW の Froala は「元に戻す・やり直す・ヘルプ」を右端に置く）。
   * 既定は書類の形：変数｜文字の大きさ・太字・斜体・下線・文字の色｜揃え・段落・箇条書き｜表・改ページ｜（spacer）元に戻す・やり直す・ヘルプ。
   * メールの形は ["variables", "|", "undo", "redo"]（plain と合わせる）。
   */
  toolbar?: readonly ArRichTextTool[];
  /** 文字と改行（`<br>`）だけにする（メールの本文。今の ARROW の htmlAllowedTags: ["br"]・pastePlain）。貼り付けも文字だけ。 */
  plain?: boolean;
  /** 「ARROWの変数」で入れられる変数のまとまり。 */
  variables?: readonly ArVariableGroup[];
  /** 変数のボタンの文字（「ARROWの変数」「ARROW 差し込み項目」など）。 */
  variablesLabel?: string;
  /** 変数の選び方。省くとデザインの形（forms.ArRichTextEditor.variables）。 */
  variablesPlacement?: "inline" | "menu";
  /** inline のとき、変数のパネルを開いておく（v-model:variablesOpen）。 */
  variablesOpen?: boolean;
  /** inline のパネルの下の説明（「押すと、入力していた場所に差し込みます」など）。 */
  variablesNote?: string;
  /** 本文の中で札に見せる変数の形。既定は `{{ $名前 }}`。g を付けた正規表現。 */
  tokenPattern?: RegExp;
  /** 文字数を出す。 */
  counter?: boolean;
  /** 文字数を出す場所。footer＝下の段（書類）、toolbar＝ツールバーの右端（メール）。デザインの形（forms.ArRichTextEditor.count）が footer ならいつも下の段。 */
  countPlacement?: "footer" | "toolbar";
  /** 文字数の上限。越えると数を赤くし、invalid と同じ見た目にする（入力は止めない）。 */
  maxLength?: number;
  /** 空のときの薄い字。 */
  placeholder?: string;
  /** 書類の紙の形で編集する（灰色の地に白い紙。書類集計の自作書類）。 */
  paper?: boolean;
  /** 紙の幅（paper のとき。既定 560px）。 */
  paperWidth?: string;
  /** 本文の高さの下限（例："240px"）。 */
  minHeight?: string;
  /** 本文の高さの上限（例："560px"）。越えたら中だけ巻き取る。 */
  maxHeight?: string;
  /** 文字の大きさの選択肢（px）。 */
  fontSizes?: readonly number[];
  /** 文字の色の選択肢。 */
  colors?: readonly string[];
  /** 書き換えられない（ツールバーも押せない）。 */
  disabled?: boolean;
  /** 読むだけ（ツールバーを隠す）。 */
  readonly?: boolean;
  /** 入力に誤りがある（赤い枠）。 */
  invalid?: boolean;
  /** 読み上げ用の名前（「書類内容」など）。 */
  label?: string;
  /** 画面の文字。 */
  labels?: Partial<ArRichTextEditorLabels>;
}

/** 画面の文字（ツールバーの名前・メニュー・文字数）。 */
export interface ArRichTextEditorLabels {
  toolbar: string;
  fontSize: string;
  bold: string;
  italic: string;
  underline: string;
  color: string;
  colorRemove: string;
  align: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  alignJustify: string;
  paragraph: string;
  paragraphNormal: string;
  heading1: string;
  heading2: string;
  heading3: string;
  heading4: string;
  list: string;
  table: string;
  pageBreak: string;
  /** 改ページの印の文字。 */
  pageBreakText: string;
  undo: string;
  redo: string;
  help: string;
  /** 文字数（{n} を数に置き換える。上限があれば {max} も）。 */
  count: string;
  countMax: string;
  /** 単語の数（classic の Froala の「Words : 5」）。 */
  words: string;
  /** 変数のメニューで、まとまりの変数の数の読み上げ（{n}）。 */
  variableCount: string;
}

export interface ArRichTextEditorEmits {
  "update:modelValue": [html: string];
  "update:variablesOpen": [open: boolean];
  /** ヘルプの道具を押したとき（使い方の画面は製品が出す）。 */
  help: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  /** 変数を入れたとき。 */
  "insert-variable": [token: string];
}

/** 外から使える操作（ref で受ける）。 */
export interface ArRichTextEditorExpose {
  /** 最後にカーソルがあった所（なければ最後）に文字を入れる。 */
  insertText: (text: string) => void;
  /** 最後にカーソルがあった所に HTML を入れる（危ないタグは消す）。 */
  insertHtml: (html: string) => void;
  /** 本文にフォーカスする。 */
  focus: () => void;
}

export type ArRichTextEditorPart =
  | "root"
  | "toolbar"
  | "tool"
  | "tool-label"
  | "tool-value"
  | "caret"
  | "separator"
  | "spacer"
  | "variables"
  | "body"
  | "paper"
  | "content"
  | "placeholder"
  | "token"
  | "footer"
  | "count"
  | "words"
  | "footer-extra";
