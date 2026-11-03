/** ArMessage 1.0 の契約。 */
export interface ArMessageProps {
  /** ok：終わった（緑のチェック）。info：案内（テーマ色）。warn：注意（橙）。danger：失敗（赤）。loading：送っている途中（回る輪）。 */
  tone?: "ok" | "info" | "warn" | "danger" | "loading";
  /** 言葉（default slot でもよい）。1行で短く。 */
  content?: string;
}
/** slot：default（言葉）。 */
export type ArMessagePart = "root" | "icon" | "spinner" | "text";

