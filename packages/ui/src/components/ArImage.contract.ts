/** ArImage 1.0 の契約。角丸の画像。押すとプレビュー（暗い幕・拡大縮小・閉じる）、読み込めないときは灰色の箱。 */
export interface ArImageProps {
  /** 画像の場所。空・読み込めないときは灰色の箱。 */
  src?: string;
  /** 画像の説明（読み上げ）。飾りなら空文字。 */
  alt: string;
  /** 幅・高さ（px か CSS の長さ）。既定はデザインが決める（remix は 150×100）。 */
  width?: number | string;
  height?: number | string;
  /** 箱への収め方。cover：切り取って埋める、contain：全体を入れる。 */
  fit?: "cover" | "contain";
  /** 押すとプレビューを開く。 */
  preview?: boolean;
  /** プレビューで出す画像（大きい画像を別に持つとき）。既定は src。 */
  previewSrc?: string;
  /** プレビューを開いているか（v-model:previewOpen）。 */
  previewOpen?: boolean;
  /** 読み込めないときに代わりに出す画像。これも読み込めなければ灰色の箱。 */
  fallback?: string;
  /** 画面の文字。 */
  labels?: { preview: string; zoomIn: string; zoomOut: string; reset: string; close: string; error: string };
}
export interface ArImageEmits {
  "update:previewOpen": [open: boolean];
  /** 読み込めなかったとき。 */
  error: [event: Event];
}
export type ArImagePart = "root" | "img" | "mask" | "placeholder" | "viewer" | "scrim" | "stage" | "picture" | "toolbar" | "tool" | "scale" | "close";
