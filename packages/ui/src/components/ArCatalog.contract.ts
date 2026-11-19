/**
 * ArCatalog 1.0 の契約。書類・集計表・テンプレートなどを「分類の一覧（左）・項目の一覧（中）・選んだ項目の説明（右）」で探して選ぶ画面。
 * 左：すべてから探す（検索）・すべて・よく使う・分類ごとの件数。中：よく使う（☆を押すと並ぶ）・分類ごとの一覧（形式の印・別のページで作る印）。
 * 右：選んだ項目の説明（中身は製品が detail スロットで描く）。
 * 画面が狭いと（1180px 以下）説明は右から出る引き出し、900px 以下は分類が横に並ぶ、700px 以下は説明が下から出る。
 */
export type ArCatalogFormat = "PDF" | "CSV" | "Excel";

export interface ArCatalogItem {
  key: string;
  /** 名前（「扶養控除等申告書」）。 */
  title: string;
  /** 出力できる形式（行の右に印）。 */
  formats?: readonly ArCatalogFormat[];
  /** 別のページで作る（行の右の印が「外へ」になる）。 */
  external?: boolean;
  /** 行の札（「出力不可：設定が必要」など）。 */
  warning?: string;
  /** 検索に使う言葉（省くと title）。 */
  keywords?: string;
}

export interface ArCatalogGroup {
  key: string;
  /** 分類の名前（「入社」）。 */
  title: string;
  /** 分類の印（ArIcon の名前）。 */
  icon?: string;
  items: readonly ArCatalogItem[];
}

export interface ArCatalogProps {
  /** 上の帯の題名（「書類・集計」）。 */
  title: string;
  /** 帯の印。 */
  icon?: string;
  groups: readonly ArCatalogGroup[];
  /** 選んでいる項目（v-model:selected）。 */
  selected?: string | null;
  /** よく使う項目（v-model:favorites。☆の順）。 */
  favorites?: readonly string[];
  /** 画面の文字。 */
  labels?: Partial<ArCatalogLabels>;
}

export interface ArCatalogLabels {
  search: string;
  all: string;
  favorites: string;
  categories: string;
  favoritesHint: string;
  allTitle: string;
  /** 「{q}」の検索結果 */
  searchTitle: string;
  /** {n}件 */
  count: string;
  clearSearch: string;
  /** 「{q}」に当てはまるものはありません… */
  empty: string;
  /** よく使うがまだないとき */
  favoritesEmpty: string;
  external: string;
  /** {title}をよく使うに入れる */
  addFavorite: string;
  removeFavorite: string;
  placeholder: string;
  close: string;
  legend: string;
}

export interface ArCatalogEmits {
  "update:selected": [key: string | null];
  "update:favorites": [keys: string[]];
}

/** slot：detail（{ item, group }。選んだ項目の説明と出力ボタン）、band-end（帯の右）、group-end（{ group }。分類の一覧の下）。 */
export type ArCatalogPart =
  | "root"
  | "band"
  | "body"
  | "nav"
  | "search"
  | "nav-list"
  | "nav-item"
  | "nav-head"
  | "nav-count"
  | "main"
  | "favorites"
  | "chip"
  | "heading"
  | "legend"
  | "empty"
  | "group"
  | "group-head"
  | "list"
  | "row"
  | "star"
  | "pick"
  | "row-title"
  | "row-group"
  | "warning"
  | "formats"
  | "format"
  | "end"
  | "aside"
  | "aside-head"
  | "aside-tag"
  | "aside-title"
  | "placeholder"
  | "scrim";
