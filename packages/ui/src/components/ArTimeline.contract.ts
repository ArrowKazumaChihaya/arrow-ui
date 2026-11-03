/** タイムラインの1つ。 */
export interface ArTimelineItem {
  /** 見出し（出勤・承認 など）。 */
  title: string;
  /** 下の小さな文字（時刻・場所など）。 */
  description?: string;
  /**
   * 点の色（意味の色）。accent：テーマ色（既定）、ok：済み・成功、danger：差し戻し・エラー、warn：気をつける、event：行事。
   */
  tone?: "accent" | "ok" | "danger" | "warn" | "event";
  /** done：済み（線の丸）、current：今（テーマ色の塗り）、pending：まだ（灰色の丸と薄い見出し）。 */
  status?: "done" | "current" | "pending";
}

/** ArTimeline 1.0 の契約。打刻・承認の履歴。 */
export interface ArTimelineProps {
  items: readonly ArTimelineItem[];
  /** left：点を左に並べる。alternate：中央の線の左右に交互に並べる。 */
  mode?: "left" | "alternate";
  /** 新しいものを上に（並びを逆に）する。 */
  reverse?: boolean;
  /** 読み上げ用の名前（例：「打刻の履歴」）。 */
  label?: string;
}
export type ArTimelinePart = "root" | "item" | "dot" | "content" | "title" | "description";
