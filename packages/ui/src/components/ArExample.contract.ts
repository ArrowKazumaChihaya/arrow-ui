import type { ArIconName } from "../icons";

/**
 * ArExample 1.0 の契約。例を入れると結果が出る説明の箱（設定の .cf-ex・.cf-row.ex）。
 * 設定がどう効くかを、具体的な例（時給1,100円・11月分・打刻 08:57〜17:08 など）で見せる。結果は製品が計算して渡す。
 */
export interface ArExampleProps {
  /** 見出し（box は「時給1,100円の人の1時間あたり（例）」など、inline は既定「例で確かめる」）。 */
  title?: string;
  /** 見出しの横の小さな札（「提案」「11月分」など）。 */
  tag?: string;
  /** 例の行（左に項目、右に太字の値）。 */
  rows?: readonly ArExampleRow[];
  /**
   * 形。box＝見出しと「項目｜値」の行を並べた箱（割増・支払設定の流れ・社員コードの次の番号）。
   * inline＝1行の箱：見出し・例の入力（default スロット）・→・結果の札（丸め）。
   */
  variant?: "box" | "inline";
  /** inline の結果（→ の右の札）。result スロットでも渡せる。入力が変わるたびに読み上げる。 */
  result?: string;
  /** 結果の札の頭のアイコン。 */
  resultIcon?: ArIconName;
  /** 結果の色（accent＝ふつう、warn＝注意、danger＝間違い）。 */
  resultTone?: "accent" | "warn" | "danger";
}
/** 例の1行。 */
export interface ArExampleRow {
  /** 見分ける値（省くと label）。 */
  key?: string | number;
  /** 項目（「法定外残業」「給与の支給日」）。 */
  label: string;
  /** 値（「1,320円（×120%）」）。 */
  value: string | number;
  /** 値の色。accent＝テーマ色（変わった値・結果）、warn＝注意、danger＝間違い、muted＝薄く。 */
  tone?: "accent" | "warn" | "danger" | "muted";
}
export type ArExamplePart = "root" | "head" | "head-icon" | "title" | "tag" | "row" | "label" | "value" | "inputs" | "arrow" | "result";
