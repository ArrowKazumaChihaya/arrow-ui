/** ArTitle 1.0 の契約。 */
export interface ArTitleProps {
  /** 見出しの段（h1〜h5）。remix では 28/22/18/16/14px。 */
  level?: 1 | 2 | 3 | 4 | 5;
  /** 意味の色（ArText と同じ）。 */
  type?: "secondary" | "muted" | "success" | "warning" | "danger" | "disabled";
  /** 1行に収まらないとき「…」で切る（全文は吹き出し）。 */
  ellipsis?: boolean;
}
export type ArTitlePart = "root";
