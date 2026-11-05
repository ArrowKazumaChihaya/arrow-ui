/** ArParagraph 1.1 の契約。 */
import type { ArTextType } from "./ArText.contract";

export interface ArParagraphProps {
  /** 意味の色（ArText と同じ）。 */
  type?: ArTextType;
  /** 文字の大きさ。sm は 12.5px（補足の段落）、md は本文 13.5px。 */
  size?: "sm" | "md";
  /** 太字。 */
  strong?: boolean;
  /** 自由記述の改行・連続した空白を保つ。長い単語は配置幅で折り返す。1行の省略表示を優先する。 */
  preserveLines?: boolean;
  /** この行数を超えたら「…」で切る（全文は吹き出し）。true は1行。 */
  ellipsis?: boolean | number;
}
export type ArParagraphPart = "root";
