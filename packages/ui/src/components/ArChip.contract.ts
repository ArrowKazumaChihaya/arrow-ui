/** ArChip 1.0 の契約。行の中に添える小さな札（「繰り返し」「2」など）。 */
export interface ArChipProps {
  /** accent：テーマ色の淡い面（既定）。event：イベントの紫。neutral：灰色。 */
  tone?: "accent" | "event" | "neutral";
}
/** slot：default（言葉・数）。 */
export type ArChipPart = "root";
