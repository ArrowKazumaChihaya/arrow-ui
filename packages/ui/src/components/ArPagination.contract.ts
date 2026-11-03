/** ArPagination 1.0 の契約。 */
export interface ArPaginationProps {
  /** 今のページ（1 から）。v-model:page。 */
  page: number;
  /** 全部の件数。 */
  total: number;
  /** 1ページの件数。v-model:pageSize。 */
  pageSize?: number;
  /** 件数の選択肢。 */
  pageSizeOptions?: readonly number[];
  /** 件数のセレクトを出す。 */
  showSizeChanger?: boolean;
  /** 「全 386 件」を出す。 */
  showTotal?: boolean;
  /** 大きさ。sm は枠のない小さなページ送り（カードの中・スマホ）。 */
  size?: "sm" | "md";
  /** 簡単な形：前へ・今のページの入力欄・「／ 全ページ数」・次へ（antd の simple。カードの中・小さな一覧）。入力して Enter で移る。 */
  simple?: boolean;
  /** 全部を押せなくする。 */
  disabled?: boolean;
  /** 1ページしかないときは出さない。 */
  hideOnSinglePage?: boolean;
  /** 読み上げ・文字（日本語の既定を変えるとき）。 */
  labels?: { nav?: string; prev?: string; next?: string; page?: (n: number) => string; perPage?: (n: number) => string; total?: (n: number) => string };
}
export interface ArPaginationEmits {
  "update:page": [page: number];
  "update:pageSize": [size: number];
  /** ページか件数を変えた。 */
  change: [page: number, pageSize: number];
}
export type ArPaginationPart = "root" | "prev" | "next" | "page" | "ellipsis" | "size" | "total" | "simple" | "jump" | "slash" | "last";
