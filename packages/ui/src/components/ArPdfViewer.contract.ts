/**
 * ArPdfViewer 1.0 の契約。PDF の表示（ページ送り・拡大縮小・何人目か）。PDF を読むのは製品：中身はページごとの画像（pages）か、iframe の src、または page slot の HTML（書類の見本）。
 * toolbar を消すと、灰色の地に白い紙を置いた「見本の枠」だけになる（書類集計の合意書類の書類詳細）。
 * デザインが選べる形（ArDesign.forms.ArPdfViewer）：
 * - bar："full"（既定。左に ‹ 1 / 5 › と「末永 修也（1人目）」、右に「− 100% ＋」）／
 *   "pager"（真ん中に ‹ 1 / 5 › だけ。2ページ以上のときだけ出す。大きさの切り替えと何人目は出さない。今の ARROW の PdfViewer。classic）。
 */
export interface ArPdfPage {
  /** ページの画像（製品が PDF から作った画像・データ URL など）。 */
  src: string;
  /** 読み上げ用の説明。省くと「{n}ページ目」。 */
  alt?: string;
}

export interface ArPdfViewerProps {
  /** ページごとの画像。 */
  pages?: readonly ArPdfPage[];
  /** iframe で出す PDF の URL（ブラウザの PDF 表示）。ページと大きさは `#page=n&zoom=z` で渡す。 */
  src?: string;
  /** page slot（HTML の見本）を使うときのページ数。pages があればその数。 */
  pageCount?: number;
  /** 出しているページ（1から。v-model:page）。 */
  page?: number;
  /** 大きさ（%。v-model:zoom）。 */
  zoom?: number;
  /** 大きさの段階（%）。 */
  zoomSteps?: readonly number[];
  /** ページごとの人（給与明細書なら1ページ＝1人）。「末永 修也（1人目）」と出す。 */
  people?: readonly string[];
  /** ページの横の文字を自分で作る（people より優先）。 */
  pageLabel?: (page: number) => string;
  /** 上の段（ページ送り・大きさ）を出す。false で見本の枠だけ。 */
  toolbar?: boolean;
  /** 紙の幅（100% のとき）。page slot の width はその実測幅（CSS px）で、画面幅変更にも追従する。 */
  paperWidth?: string;
  /** 100% 表示を表示枠に収めるときの最大幅（CSS px）。指定時は paperWidth より優先し、拡大時はこの基準幅から拡大する。 */
  fitWidth?: number;
  /** 紙の高さの下限（100% のとき。A4 の見本なら 780px）。 */
  paperMinHeight?: string;
  /** 全体の高さ（例："640px"）。省くと中身の高さ。 */
  height?: string;
  /** 読み上げ用の名前（「給与明細書のプレビュー」など）。 */
  label?: string;
  /** 画面の文字。page は {page} {count}、person は {name} {n} を置き換える。 */
  labels?: Partial<ArPdfViewerLabels>;
}

export interface ArPdfViewerLabels {
  prev: string;
  next: string;
  zoomIn: string;
  zoomOut: string;
  zoomGroup: string;
  page: string;
  person: string;
  pageAlt: string;
}

export interface ArPdfViewerEmits {
  "update:page": [page: number];
  "update:zoom": [zoom: number];
}

export type ArPdfViewerPart =
  | "root"
  | "bar"
  | "prev"
  | "next"
  | "counter"
  | "who"
  | "spacer"
  | "zoom"
  | "zoom-out"
  | "zoom-in"
  | "zoom-value"
  | "viewport"
  | "paper"
  | "image"
  | "frame";
