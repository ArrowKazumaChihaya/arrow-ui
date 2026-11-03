/**
 * ArOrgChart 1.0 の契約。組織図：部署・店舗の親子のつながりの図（会社情報の「部署/店舗階層構造」）。
 * 子のある札の下の丸い印で開け閉め、右下で拡大縮小・「全体を表示」、地をドラッグで動かす・ホイールで拡大縮小。札を押すと select。
 */
export interface ArOrgNode {
  /** 部署・店舗を見分ける値。 */
  key: string;
  /** 名前（「ARROW事業部」）。 */
  label: string;
  /** 部署/店舗ID（「arrow」）。 */
  code?: string;
  /** 所属人数。 */
  count?: number;
  /** 人数の文字を自分で作る（「直属 0人」など）。省くと「{count}人」。 */
  countLabel?: string;
  /** 子の部署・店舗。 */
  children?: readonly ArOrgNode[];
}

export interface ArOrgChartProps {
  /** いちばん上の部署・店舗（横に並ぶ）。 */
  nodes: readonly ArOrgNode[];
  /** 開いている札の key（v-model:expanded）。省くと全部開いた状態から始める。 */
  expanded?: readonly string[];
  /** 大きさ（1＝100%。v-model:zoom）。 */
  zoom?: number;
  /** 大きさの下限・上限・1回の変化。 */
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  /** 選んでいる札の key。 */
  selected?: string | null;
  /** 図の高さ（既定 560px）。 */
  height?: string;
  /** 左下の操作の案内を出す。 */
  hint?: boolean;
  /** 読み上げ用の名前。 */
  label?: string;
  /** 画面の文字。count は {n}、open・close は {label} を置き換える。 */
  labels?: Partial<ArOrgChartLabels>;
}
export interface ArOrgChartLabels {
  count: string;
  hint: string;
  zoomIn: string;
  zoomOut: string;
  zoomGroup: string;
  fit: string;
  open: string;
  close: string;
  node: string;
}
export interface ArOrgChartEmits {
  /** 札を押したとき（その部署/店舗の情報を開く）。 */
  select: [node: ArOrgNode];
  "update:expanded": [keys: string[]];
  "update:zoom": [zoom: number];
}
export type ArOrgChartPart =
  | "root"
  | "viewport"
  | "canvas"
  | "branch"
  | "node-wrap"
  | "node"
  | "node-head"
  | "node-icon"
  | "name"
  | "code"
  | "count"
  | "count-icon"
  | "toggle"
  | "children"
  | "child"
  | "controls"
  | "zoom-out"
  | "zoom-in"
  | "zoom-value"
  | "fit"
  | "hint";
