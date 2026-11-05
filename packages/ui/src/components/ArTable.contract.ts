/**
 * ArTable 1.5 の契約。並べ替えと絞り込みはしない（データの順番は製品の Logic が決める）。
 * デザインが選べる形（ArDesign.forms.ArTable）：
 * - selectHead："check"（既定。見出しはチェックだけ）／"label"（チェックの左に「全選択」の文字。今の ARROW の SelectTable。classic）。
 * - dragHandle："column"（既定。並べ替えのつまみを左の専用の列に）／"cell"（1列目のセルの頭に。今の ARROW の SortableTable。classic）。
 * - groupToggle："chevron"（既定。まとまりを開け閉めする見出しに ∨／›、列の見出しから開くのは ＋／−）／"menu"（今の ARROW の Th の isToggle の menu の絵。classic）。
 * 行の並べ替え（sortableRows）：1列目のつまみをドラッグするか、つまみで Alt+↑↓。並べた行は update:rows（v-model:rows）と reorder で渡す。
 *
 * 1.1 で、給与・年調・勤怠の集計表のために足した：
 * - 右に止める列（sticky: "end"）。左右とも止めた列の端に影。
 * - 2段の見出し（columnGroups と列の group）。見出しを押すと列のまとまりが開く（collapsible・v-model:openGroups）、列の show で開いた／閉じたときだけ出す。
 *   ほかの列の見出しから開くこともできる（列の toggles：年調の「合計」を押すと月ごとの列が開く）。
 * - 行をまたぐセル（列の rowSpan）。
 * - 表の中の小さな金額の入力（列の edit・v-model:edits・invalidCells）。直した欄はテーマ色の淡い地（給与のページでは黄色）。
 * - 3段の金額のセル（列の stack：値の配列を 24px の行に縦に並べる。課税支給／社会保険料等／所得税）。edit と合わせると3つの入力。
 * - 数字の下の小さな行（列の delta：前月との差「+12,000（前月比）」）。
 *
 * 1.2 で、シフト画面・シフトのポップアップのために足した：
 * - cell-<key> のスロットの引数に Default（既定の表示を描く部品）。行の中で追加する行だけ入力に差し替え、
 *   ほかの行は `<component :is="Default" />` で既定の表示（頭文字の丸・名前・色の四角つきの sub など）のまま出せる。
 * - 段に分ける列（列の lines）。値の配列を1つずつ「行の中の段」に出し、段の高さを列をまたいで揃える
 *   （休憩を分けて持つ会社の「休始・休終」、募集の日ごとの「パターン・時間・人数」）。段のない列は段をまたぐ。
 *   段のセルは cell-<key> のスロットで差し替えられ、引数の line が段の番号、value がその段の値。
 * - 表の中の入力の種類（列の editor）：amount（金額。既定）・text（文字）・time（時刻。ArTimeInput）・select（選ぶ。ArSelect）。
 *   値は v-model:edits に入る（time は { time, day }、select は選んだ値）。
 *
 * 1.3 で、ダイアログの中の従来の表（Table・Th・SortableTable）の置き換えのために足した：
 * - 入力の行（editing）：その行だけ editor のある列を入力にし、［取り消し］［確定］と commit・cancel（Esc・Ctrl＋Enter）。
 * - 時間の組の段（editor="time-range"）：1つのセルに「開始〜終了」を段で並べて編集。最後の組が埋まると空の組を足し、× で消す。
 * - 行のドラッグの並べ替えは 1.1 の sortableRows（reorder・v-model:rows）、セルの結合は列の rowSpan のまま。
 *
 * 1.4 で、本体の行のセルを横につなぐために足した（今の UiTableCell の colspan）：
 * - 列の colSpan(row, index)：数を返すと右の列をその数だけまたぎ、またがれた列のセルは出さない（残りの列の数までに切る）。
 *   止めた列（sticky）：またぐ列がすべて左に（右に）止めた列のときだけ止める。止めた列と止めない列をまたぐセルは止めない（横にスクロールすると動く）。
 *   段（lines）：つなぐ数は行ごとに1つで、どの段でも同じ列をまたぐ。段のない列から始まるセルは段もまたぐ。
 *   rowSpan：上の行の rowSpan がかかっている列はまたがない数を返す（重ねると表が崩れる。数えるのは製品）。
 *   入力の行（editing）：つないだセルは始まりの列の editor で入力になる。
 * - 行ぜんぶを1つのセル（fullRow と #full-row）：案内・説明の行。チェック・開く・つまみ・操作の列もまたぐ。全選択には数えない。
 * 並べ替えの状態は v-model:sort（{ key, order } か null）。製品が持つので、画面を移っても製品の store に残せば保てる。
 */
import type { ArIconName } from "../icons";
import type { ArAvatarTone } from "./ArAvatar.contract";
import type { ArSelectOption } from "./ArSelect.contract";
import type { ArTimeValue } from "./ArTimeInput.contract";

/** 時間の組（開始〜終了）。editor="time-range" の値の1つ。時刻は "09:00" でも { time, day } でもよい（入力したものは { time, day }）。 */
export interface ArTableTimeRange {
  start: ArTimeValue | string | null;
  end: ArTimeValue | string | null;
}
/** 表の中の入力の値。amount・text は文字、time は { time, day }、select は選んだ値（null は未選択）、time-range は時間の組の配列。 */
export type ArTableEditValue = string | number | null | ArTimeValue | readonly ArTableTimeRange[];

/** 入力の行の確定（commit）・取り消し（cancel）。values は、その行の入力できる列の今の値（列の key → 値。time-range は空の組を除いた配列）。 */
export interface ArTableRowEdit<Row> {
  key: ArRowKey;
  row: Row;
  values: Record<string, ArTableEditValue | readonly ArTableEditValue[]>;
}

export type ArRowKey = string | number;

/** 名前の列の頭文字の丸。 */
export interface ArTableAvatar {
  /** 丸に出す文字。省くと値の1文字目。 */
  text?: string;
  /** 色。省くと seed から人ごとの色を選ぶ（seed もなければテーマ色）。 */
  tone?: ArAvatarTone;
  /** 人ごとの色を選ぶ元（社員の番号など）。同じ seed なら同じ色。 */
  seed?: string | number;
}

export interface ArTableColumn<Row> {
  /** 1.5：長い見出しと本文をセル内で折り返し、本文の改行を保持する。日付・金額などは省略して従来の表示を保つ。 */
  wrap?: boolean;
  /** 列の名前（slot の名前 cell-<key> にも使う）。 */
  key: string;
  /** 見出しの文字。 */
  title: string;
  /** 寄せ。省くと numeric の列は end、ほかは start。 */
  align?: "start" | "center" | "end";
  /** px。データに合わせた幅は数で渡してよい。省くと中身に合わせる。 */
  width?: number;
  /**
   * 横にスクロールしても残す。true・"start"＝左に（左から続けて指定する）、"end"＝右に（右から続けて指定する。年調の「反映」）。
   * 止めた列は2段の見出しのまとまり（group）に入れない。
   */
  sticky?: boolean | "start" | "end";
  /** 見出しを押すと並べ替えの印が変わり update:sort を出す。 */
  sortable?: boolean;
  /** セルに出す値。省くと row[key]。配列を返すと1行ずつ並べる（1日に2つの時間帯など）。 */
  value?: (row: Row) => unknown;
  /** 数字の列。等幅の数字にし、align を省くと右寄せにする。 */
  numeric?: boolean;
  /** 文字の強さ。strong＝太字（時刻など）、muted＝灰色（区分・休憩など）、note＝少し小さな補足の文（備考など）。 */
  emphasis?: "strong" | "muted" | "note";
  /** 名前の列：頭文字の丸を名前の前に付ける。true なら値の1文字目と人ごとの色。 */
  avatar?: boolean | ((row: Row) => ArTableAvatar);
  /** 名前の下の小さな灰色の文字（「通常勤務2」など）。color を渡すと文字の前に色の小さな四角（パターンの色）。 */
  sub?: (row: Row) => string | { text: string; color?: string } | undefined;
  /** 2段の見出しのまとまり（columnGroups の key）。同じまとまりの列は続けて並べる。 */
  group?: string;
  /** まとまりが開いているとき（open）・閉じているとき（closed）だけ出す。省くといつも出す。 */
  show?: "open" | "closed";
  /** まとまりの合計の列（淡いテーマ色の地。見出しは少し濃く）。 */
  total?: boolean;
  /** この列の見出しを、まとまりを開け閉めするボタンにする（columnGroups の key。年調の「合計」→ 月ごとの列）。 */
  toggles?: string | readonly string[];
  /** 行をまたぐ。数を返すとその行数ぶん下へつなぎ、0 を返すとその行のセルを出さない（上の行のセルがまたいでいる）。 */
  rowSpan?: (row: Row, index: number) => number;
  /**
   * 横につなぐ。数を返すと右の列をその数だけまたぎ（自分を含む）、またがれた列のセルは出さない（今の UiTableCell の colspan）。
   * 1 か省くとつながない。止めた列・段・rowSpan との決まりは上の 1.4 の説明。
   */
  colSpan?: (row: Row, index: number) => number;
  /**
   * 表の中の小さな金額の入力にする（高さ24・右寄せ）。値は v-model:edits の「行のkey:列のkey」（stack のときは「:段の番号」を足す）に入る。
   * 関数を渡すと行ごとに入力にするかを決める（ロック中の店舗の人は入力にしない、など）。
   */
  edit?: boolean | ((row: Row) => boolean);
  /** 入力の読み上げの名前（「末永 修也さんの残業手当」）。段の番号は stack のとき。 */
  editLabel?: (row: Row, line?: number) => string;
  /**
   * 表の中の入力の種類（edit のとき・editing の行のとき）。amount＝小さな金額（既定・右寄せ）、text＝文字、
   * time＝時刻（ArTimeInput の sm。dayShift・overnight を渡せる）、select＝選ぶ（ArSelect の sm。options）、
   * time-range＝1つのセルに時間の組（開始〜終了）を段で並べて編集する（値は ArTableTimeRange の配列。自動で段に分ける列になる。シフトパターンのシフト・勤怠・休憩）。
   */
  editor?: "amount" | "text" | "time" | "select" | "time-range";
  /**
   * editor="time-range"：入力の行で、最後の組が埋まると下に空の組を1つ足す（今の ARROW の「時刻を入れると下に次の行が出る」）。既定 true。
   * 組の右の × で消せる（removable、既定 true）。
   */
  appendEmpty?: boolean;
  removable?: boolean;
  /** セルの頭に置く小さな文字（時刻の範囲の「〜」など。前の列とつなげて読ませる）。 */
  lead?: string;
  /** editor="select" の選択肢（行ごとに変えるなら関数）。 */
  options?: readonly ArSelectOption[] | ((row: Row) => readonly ArSelectOption[]);
  /** 入力が空のときの薄い文字。 */
  placeholder?: string;
  /** editor="time"：［当日⇄前日］の切り替えを出す（出勤・退勤・休始・休終）。 */
  dayShift?: boolean;
  /** editor="time"：24:00 以降を受ける（夜勤）。 */
  overnight?: boolean;
  /**
   * 段に分ける列。値の配列を1つずつ「行の中の段」に出し、段の高さを列をまたいで揃える（段のない列は段をまたいで1つ）。
   * 行の段の数は、段に分ける列の配列のいちばん長いもの（短い列は空の段で埋める）。入力の key には「:段」を足す。
   */
  lines?: boolean;
  /** 値の配列を 24px の行に縦に並べる（3段の金額のセル）。 */
  stack?: boolean;
  /** 値の下の小さな行（前月との差など）。tone：warn＝目立たせる（10%以上の差）、muted＝灰色（既定）。 */
  delta?: (row: Row) => string | { text: string; tone?: "warn" | "muted" | "danger" } | undefined;
  /** 手で直した値の印（値の後ろの小さな鉛筆。読み上げ「手で直した金額」）。 */
  marked?: (row: Row) => boolean;
}

/** 2段の見出しのまとまり（「支給」「控除」「給与」「賞与」）。 */
export interface ArTableColumnGroup {
  key: string;
  /** 上の段の見出し。 */
  title: string;
  /** 見出しを押すと開け閉めできる。閉じると show:"closed" の列（合計）だけが1段で出る。 */
  collapsible?: boolean;
  /** 開いているときの見出しの横の小さな文字（既定「閉じる」）。 */
  openHint?: string;
  /** 閉じているときの見出しの横の小さな文字（既定「内訳」）。 */
  closedHint?: string;
}

/**
 * 合計の行の1つのセル。文字か数、または小さな見出しつきの値（シフト画面の「出勤 / 4名」）。
 * span で右の列とつなげる（つないだ列の値は使わない）。
 */
export type ArTableFooterValue = string | number | { label?: string; value: string | number; span?: number };

export interface ArTableSort {
  key: string;
  order: "asc" | "desc";
}

export interface ArTableLabels {
  /** 見出しのチェックの名前。 */
  selectAll: string;
  /** 見出しのチェックの左に出す文字（selectHead="label" の形のとき。既定「全選択」）。 */
  selectAllText?: string;
  /** 行のチェックの名前。 */
  selectRow: string;
  /** 開くボタンの名前。 */
  expand: string;
  /** 閉じるボタンの名前。 */
  collapse: string;
  /** 行の右端の操作の列の見出し（読み上げだけ）。 */
  actions: string;
  /** 並べ替えのつまみの名前（sortableRows のとき）。 */
  dragHandle: string;
  /** 並べ替えたあとに読み上げる文。{n} は新しい順番（1から）。 */
  moved: string;
  /** 入力の行の確定・取り消しのボタンの名前。 */
  commit?: string;
  cancel?: string;
  /** time-range の組を消すボタンの名前。 */
  removeRange?: string;
}

/** 行を並べ替えたとき（reorder）。from・to は rows の中の順番（0から）。 */
export interface ArTableReorder {
  key: ArRowKey;
  from: number;
  to: number;
}

export interface ArTableProps<Row> {
  /**
   * 1.5：利用可能な幅に表を収める。columns.widthを指定した列を優先し、残りを未指定の列へ配分する。
   * 長文の列はwrapを併用する。省略時は各テーマの従来の表幅と横スクロールを維持する。
   */
  fit?: boolean;
  /** 列。 */
  columns: readonly ArTableColumn<Row>[];
  /** 行のデータ（並べ替え・絞り込み・ページ分けは製品がしたもの）。 */
  rows: readonly Row[];
  /** 行を見分ける値（キーの名前か関数）。 */
  rowKey: keyof Row | ((row: Row) => ArRowKey);
  /** 表の名前（読み上げ・スクロール領域の名前）。 */
  caption: string;
  /**
   * 形。box＝外枠（角丸12・線）の中に見出しと行（ポップアップ・一覧の表）。
   * board＝外枠なし・見出しは角の丸い淡いテーマ色の帯・行は高め（シフト画面の「勤務メンバー」「勤務可能な人」）。
   */
  variant?: "box" | "board";
  /** 左にチェックを出して行を選べるようにする（見出しのチェックで表に出ている行をすべて）。 */
  selectable?: boolean;
  /** 選んでいる行の key（v-model:selected）。 */
  selected?: readonly ArRowKey[];
  /** 並べ替えの状態（v-model:sort）。 */
  sort?: ArTableSort | null;
  /** 左に開くボタンを出し、#expanded の中身を行の下に開けるようにする。 */
  expandable?: boolean;
  /** 開いている行の key（v-model:expanded）。 */
  expanded?: readonly ArRowKey[];
  /** 合計の行。列の key → 表示する値。#foot-<key> で差し替えられる。 */
  footer?: Readonly<Record<string, ArTableFooterValue>> | null;
  /** 見出しをスクロールしても上に残す。 */
  stickyHeader?: boolean;
  /** 行の高さ。compact は詰めた表（ポップアップの中の長い一覧など）。 */
  density?: "regular" | "compact";
  /** 行がないときの文。次にできることを書く（「上の『シフト追加』から登録できます」）。 */
  emptyText?: string;
  /** 行がないときの線のアイコン。 */
  emptyIcon?: ArIconName;
  /** 値が空（null・undefined・""）のセルに出す文字。 */
  blank?: string;
  /** 薄く出す行（シフトなし・ロック中など）。押せることは変わらない。 */
  rowOff?: (row: Row) => boolean;
  /** 読み上げの名前。 */
  labels?: Partial<ArTableLabels>;
  /**
   * 行をドラッグで並べ替えられるようにする（今の ARROW の SortableTable）。つまみは左の列か1列目の頭（デザインが選ぶ）。
   * マウスはつまみをつかんで上下へ、キーボードはつまみで Alt+↑↓。並べた行は update:rows（v-model:rows）と reorder で渡す。
   */
  sortableRows?: boolean;
  /** 2段の見出しのまとまり。 */
  columnGroups?: readonly ArTableColumnGroup[];
  /** 開いているまとまりの key（v-model:openGroups）。 */
  openGroups?: readonly string[];
  /** 表の中の入力の値（v-model:edits）。key は「行のkey:列のkey」（stack・lines は「:段」）。ここにある値を入力に出し、元の値と違えば「直した欄」にする。 */
  edits?: Readonly<Record<string, ArTableEditValue>>;
  /** 間違いのある入力の key（赤い枠）。 */
  invalidCells?: readonly string[];
  /**
   * 入力に切り替えている行の key（今の ARROW の「追加の行」「編集の行」）。その行だけ editor のある列を入力にし、
   * 右端に［取り消し］［確定］（#edit-actions で差し替え）を出す。確定は commit、取り消しは cancel（edits からその行の値を消す）。
   * Esc で取り消し、Ctrl＋Enter で確定。入力の行があるあいだは行の並べ替えのつまみを押せない。
   */
  editing?: readonly ArRowKey[];
  /**
   * 行ぜんぶを1つのセルにする行（1行いっぱいの案内・説明の行）。true の行は #full-row（{ row, index }）で中身を描く。
   * チェック・開く・つまみ・操作の列もまたぎ、全選択には数えない。
   */
  fullRow?: (row: Row) => boolean;
}

export interface ArTableEmits<Row> {
  "update:selected": [keys: ArRowKey[]];
  "update:sort": [sort: ArTableSort | null];
  "update:expanded": [keys: ArRowKey[]];
  "row-click": [row: Row, index: number];
  /** 並べ替えた後の行（v-model:rows）。 */
  "update:rows": [rows: Row[]];
  /** 並べ替えた1行。 */
  reorder: [move: ArTableReorder];
  /** 開いているまとまり（v-model:openGroups）。 */
  "update:openGroups": [keys: string[]];
  /** 表の中の入力の値（v-model:edits）。 */
  "update:edits": [edits: Record<string, ArTableEditValue>];
  /** 入力の行の［確定］（Ctrl＋Enter）。保存して editing・edits から外すのは製品。 */
  commit: [edit: ArTableRowEdit<Row>];
  /** 入力の行の［取り消し］（Esc）。その行の edits は消して update:edits を出してある。 */
  cancel: [edit: ArTableRowEdit<Row>];
}

/**
 * slot：
 * full-row（{ row, index }：fullRow の行の中身）、edit-actions（{ row, commit, cancel }：入力の行の右端。既定は［取り消し］［確定］）、
 * cell-<key>（{ row, value, index, line, Default }：Default は既定の表示を描く部品、line は段に分けた列の段の番号）・head-<key>（{ column }）・foot-<key>（{ value }）・expanded（{ row }）・empty、
 * actions（{ row, index }：行の右端の操作。アイコンだけのボタンに aria-label を付ける）、
 * before-rows（見出しのすぐ下・行の上。シフト画面の「シフト追加」）、
 * below（表の下。ArPagination や「表示内容」のプルダウンを置く）。
 */
export type ArTablePart =
  | "root"
  | "viewport"
  | "table"
  | "head"
  | "header-cell"
  | "sort"
  | "sort-icon"
  | "body"
  | "row"
  | "cell"
  | "person"
  | "name"
  | "sub"
  | "sub-mark"
  | "lines"
  | "check"
  | "select"
  | "check-box"
  | "select-text"
  | "expand-toggle"
  | "expanded-row"
  | "before-rows"
  | "actions"
  | "foot"
  | "foot-label"
  | "foot-value"
  | "empty"
  | "below"
  | "drag-handle"
  | "status"
  | "group-cell"
  | "group-toggle"
  | "toggle-hint"
  | "stack"
  | "cell-input"
  | "cell-editor"
  | "lead"
  | "range-sep"
  | "line-remove"
  | "edit-actions"
  | "delta"
  | "mark";
