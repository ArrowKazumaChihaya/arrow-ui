/** ArPayslip 1.0 の契約。明細書の紙の形（勤怠／支給／控除／その他の4列、合計、前回と比べる）。給与・賞与・報酬・マイページの明細。 */

/** 明細の1行。 */
export interface ArPayslipRow {
  /** 項目名（「基本給」「出勤日数」）。 */
  label: string;
  /** 値。数は3桁区切りで右に寄せ、マイナスは赤。文字（「17日」「134:42」「甲」）はそのまま。 */
  value: number | string;
  /** 前回の値（数のとき）。compare のときに差を出す。 */
  prev?: number | null;
  /** 差を文字で渡す（時間・日数など。「+7:51」「−1,954」）。渡すと prev より優先。 */
  diff?: string;
  /** 手で直した金額の印（ペン）を付ける。 */
  edited?: boolean;
  /** 合計の行（淡いテーマ色の地・太字）。 */
  total?: boolean;
  /** 大きい金額（差引支給額）。 */
  big?: boolean;
}
/** 1つの表（「支給」など）。 */
export interface ArPayslipSection {
  title: string;
  rows: ArPayslipRow[];
}
/** 下の合計の箱（総支給額・控除合計・差引支給額…）。 */
export interface ArPayslipTotal {
  label: string;
  value: number | string;
  /** 単位（既定「円」。空文字で付けない）。 */
  unit?: string;
  prev?: number | null;
  diff?: string;
  /** 強める（差引支給額。大きな字と淡いテーマ色の地）。 */
  emphasis?: boolean;
}
export interface ArPayslipMeta {
  label: string;
  value: string;
}

export interface ArPayslipProps {
  /** 書類の名前（「給与明細書」「賞与明細書」「報酬明細書」）。 */
  title: string;
  /** 支給分（「2026年11月25日支給分」）。 */
  period?: string;
  /** 右上の項目（会社・所属・氏名・社員コード）。classic は今の ARROW と同じく、1つ目（会社）を札なしの大きな会社名として上に出す。 */
  meta?: ArPayslipMeta[];
  /** 列。1つの列に表を1つ、または上から並べる表の配列（その他・差引支給額・振込支給額…）。ふつうは 勤怠／支給／控除／その他 の4列。 */
  columns?: (ArPayslipSection | ArPayslipSection[])[];
  /** column-0〜column-3 slotで入力可能な明細を組むときの列数。配列方式では省略する。 */
  columnCount?: 1 | 2 | 3 | 4;
  /** 下に並べる合計の箱。 */
  totals?: ArPayslipTotal[];
  /**
   * 前回と比べる。off＝比べない。diff＝値の下に差だけ（マイページ）。prev＝値の右に「前 ○○」と差（管理者の「前月と比べる」）。
   * 差が + は茶、− は青（prev）。合計の箱の差は − が緑・+ が茶。
   */
  compare?: "off" | "diff" | "prev";
  /**
   * 並べ方。auto＝幅が狭いと列を縦に積む（既定）。wide＝どの幅でも4列の横長の明細のまま、幅に合わせて小さく縮めて出す（スマホの「明細」表示）。
   */
  layout?: "auto" | "wide";
  /** 行の高さ。md＝38（マイページ）・sm＝34（管理者。勤怠の列は30）。 */
  size?: "md" | "sm";
  /** 差が0のときの文字。 */
  zeroDiff?: string;
  /** 「前」の文字。 */
  prevLabel?: string;
}
/** slot：toolbar（見出しの右）、column-0〜column-3（ArPayslipTableとArPayslipLineで構成する列）。 */
export type ArPayslipPart = "root" | "head" | "title" | "period" | "meta" | "toolbar" | "columns" | "column" | "section" | "section-title" | "row" | "label" | "value" | "edited" | "diff" | "prev" | "totals" | "total" | "unit";
