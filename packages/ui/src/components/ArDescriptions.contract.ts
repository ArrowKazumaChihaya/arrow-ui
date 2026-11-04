/** ArDescriptions 1.1 の契約。 */

export interface ArDescriptionsItem {
  /** 項目の名前（slot の名前 item-<key> にも使う）。 */
  key: string;
  /** ラベル。 */
  label: string;
  /** 値。#item-<key> で差し替えられる。 */
  value?: string | number;
  /** 何列分を使うか（1〜column）。 */
  span?: number;
  /** 値の色（不足など）。 */
  tone?: "danger" | "warn" | "ok";
}

export interface ArDescriptionsProps {
  /** 項目。 */
  items: readonly ArDescriptionsItem[];
  /** 1行に並べる項目の数。 */
  column?: number;
  /**
   * 形。bordered＝枠つきの表（ラベルの地は淡いテーマ色）、plain＝枠なしで「ラベル 値」を並べる（日の要約の形）。
   */
  variant?: "bordered" | "plain";
  /** inline＝ラベルと値を横に並べる。stacked＝ラベルを上、値を下へ置く（スマホの申請事由・長い文章）。 */
  layout?: "inline" | "stacked";
  /** 上の見出し。 */
  title?: string;
  /** 見出しの段階。 */
  headingLevel?: 2 | 3 | 4;
}

/** slot：item-<key>（{ item }）・label-<key>（{ item }）・extra（見出しの右）。 */
export type ArDescriptionsPart = "root" | "header" | "title" | "extra" | "list" | "item" | "label" | "value";
