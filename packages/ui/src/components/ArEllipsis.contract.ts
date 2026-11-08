/** ArEllipsis 1.0 の契約。はみ出す文字を「…」で切り、全文は吹き出しで見せる（今の ARROW の Ellipsis）。 */
export interface ArEllipsisProps {
  /** 文字（default slot でもよい。吹き出しにも同じものを出す）。 */
  text?: string;
  /** 何行で切るか。既定 1。 */
  lines?: number;
  /** 最大幅。数値はpx。内容に合わせて広がるテーブルのセルでも省略幅を固定できる。 */
  maxWidth?: number | string;
  /** 吹き出しを出す側。 */
  placement?: "top" | "bottom";
}
export type ArEllipsisPart = "root" | "text";
