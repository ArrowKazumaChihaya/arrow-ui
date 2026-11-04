/**
 * ArChangedValue 1.2 の契約。変更前→変更後の表示（今の ARROW の ChangedValue）。
 * 1.1 で、いくつかの項目をまとめて見せる形を足した（items）：
 * table＝「項目｜変更前｜変更後」の表（保存前の確認・変更履歴の詳細）、list＝1列に「項目」と「変更前 → 変更後」を縦に並べる一覧（スマホや狭い確認の画面）。
 * 1.2 で、今の UI/ChangedValue とまったく同じ表記の形を足した（layout="text"）：文字は「変更前 → 変更後」（矢印の前後に半角の空白）の1つの文、
 * 変わったときは根に class="changed" と data-state="changed"。空の値は空の文字のまま（empty を使わない）、変わったかは before と after をそのまま比べる。
 */
export interface ArChangedValueProps {
  before?: string | number | null;
  after?: string | number | null;
  /** 変わったかどうか。省くと before と after を比べる。 */
  changed?: boolean | null;
  /** 値が空のときに出す文字（既定「—」）。 */
  empty?: string;
  labels?: { before: string; after: string };
  /** まとめて見せる項目（渡すと表か一覧になる）。 */
  items?: readonly ArChangedValueItem[] | null;
  /**
   * 形。inline＝文の中の「前 → 後」（items を渡さないとき。前後の値を部位に分け、読み上げに「変更前」「変更後」を添える）。
   * text＝今の UI/ChangedValue と同じ「前 → 後」の1つの文（class="changed"。固定のテストや文字で比べる所と合う）。
   * table＝「項目｜変更前｜変更後」の表。list＝「項目」の下に「前 → 後」を並べる1列の一覧。items を渡して省くと table。
   */
  layout?: "inline" | "text" | "table" | "list";
  /** 表の見出しの文字（既定「項目」「変更前」「変更後」。list の見出しは「項目（変更前 → 変更後）」）。 */
  headers?: Partial<ArChangedValueHeaders>;
  /** 金額などの数。変更前・変更後を右に寄せ、等幅の数字にする。 */
  numeric?: boolean;
  /** 表の名前（読み上げ）。 */
  caption?: string;
}
export interface ArChangedValueHeaders {
  label: string;
  before: string;
  after: string;
  /** list の見出し。 */
  list: string;
}
/** まとめて見せる1項目。 */
export interface ArChangedValueItem {
  /** 見分ける値（省くと label）。 */
  key?: string | number;
  /** 項目名（「シフト提出」「末永 修也 残業手当」など）。 */
  label: string;
  before?: string | number | null;
  after?: string | number | null;
}
export type ArChangedValuePart = "root" | "before" | "arrow" | "after" | "head" | "head-cell" | "row" | "label" | "cell" | "change";
