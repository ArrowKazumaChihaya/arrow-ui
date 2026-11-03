/** ArBadge 1.0・ArRibbon 1.0 の契約。 */

export interface ArBadgeProps {
  /** 件数。子（アイコンのボタンなど）の右上に重ねる。子がなければその場に出す。 */
  count?: number;
  /** これを超えると「99+」のように出す。 */
  max?: number;
  /** 0 でも出す。 */
  showZero?: boolean;
  /** 数を出さずに点だけ（新しいものがある）。 */
  dot?: boolean;
  /** 件数・点の色。danger＝赤（重要）、accent＝テーマ色、neutral＝灰色。 */
  tone?: "danger" | "accent" | "neutral";
  /**
   * 状態の点（出勤中・処理中・未提出・エラー）。渡すと件数ではなく「点＋言葉」の形になる。
   * ok＝緑、accent＝テーマ色（淡い輪つき＝処理中）、warn＝橙、danger＝赤、neutral＝灰色。
   */
  status?: "ok" | "accent" | "warn" | "danger" | "neutral";
  /** 状態の言葉（default slot でも渡せる）。 */
  text?: string;
  /** 読み上げの名前（件数のとき）。省くと「n件」。 */
  label?: string;
}

export interface ArRibbonProps {
  /** リボンの言葉（「おすすめ」）。 */
  text: string;
  /** 色。accent＝テーマ色の塗りに白文字。 */
  tone?: "accent" | "danger" | "ok" | "warn";
  /** 右上（end）か左上（start）。 */
  placement?: "end" | "start";
}

export type ArBadgePart = "root" | "count" | "dot" | "status-dot" | "text";
export type ArRibbonPart = "root" | "content" | "ribbon" | "corner";
