/** ArForm 1.0 の契約。 */

/** 検証の決まり（1つの項目に配列で複数並べられる）。間違いの文は直し方まで書く。 */
export interface ArFormRule {
  /** 空にできない。 */
  required?: boolean;
  /** 数の最小・最大（数のとき）。 */
  min?: number;
  max?: number;
  /** 文字数の最小・最大（文字のとき）。配列なら数。 */
  minLength?: number;
  maxLength?: number;
  /** 形（例：/^\d{3}-\d{4}$/）。 */
  pattern?: RegExp;
  /** 自分で確かめる。間違いなら文を返す（true・undefined・空文字は合っている）。Promise でもよい。 */
  validator?: (value: unknown, model: Record<string, unknown>) => string | boolean | undefined | Promise<string | boolean | undefined>;
  /** 間違いの文（省くと決まりから作る）。 */
  message?: string;
}

export interface ArFormProps {
  /** 入力の値をまとめたもの（ArField の name がこのキー）。 */
  model: Record<string, unknown>;
  /** name ごとの検証の決まり。 */
  rules?: Record<string, ArFormRule | readonly ArFormRule[]>;
  /** stacked：ラベルが上（ポップアップ）。inline：ラベルが左・120px 右寄せ（設定の画面）。中の ArField に配る。 */
  layout?: "stacked" | "inline";
  /** inline のラベルの幅。sm＝88px・md＝120px・lg＝168px。 */
  labelSize?: "sm" | "md" | "lg";
  /** inline のラベルの幅（CSS の長さ。例："25%"＝今の ARROW の Form の label-col 6/24）。labelSize より優先。 */
  labelWidth?: string;
  /** いつ確かめるか。submit：送るときだけ。blur：項目から出たとき。change：打つたび（一度送ったあとは常に change）。 */
  validateOn?: "submit" | "blur" | "change";
  /** 送って間違いがあったとき、上に間違いのまとめを出す（押すとその項目へ）。 */
  summary?: boolean;
  /** 間違いのまとめの見出し（{n} は件数）。 */
  summaryTitle?: string;
  /** 外から渡す間違い（サーバーの返事など）。name → 文。 */
  errors?: Record<string, string | undefined>;
}

export type ArFormPart = "root" | "summary" | "summary-title" | "summary-list" | "summary-item";
