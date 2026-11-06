/** ArList 1.1 の契約（antd 6 の Listy の形：グループの見出し・右に操作）。 */
import type { ArAvatarTone } from "./ArAvatar.contract";

export interface ArListItem {
  /** 項目を見分ける値。 */
  key: string | number;
  /** 1行目の太字（名前）。 */
  title: string;
  /** 2行目の灰色の小さな文字（「09:00〜18:00 ／ 渋谷店」）。 */
  description?: string;
  /** 頭文字の丸。true なら title の1文字目。1.1: src を渡すと写真。 */
  avatar?: boolean | { src?: string; text?: string; tone?: ArAvatarTone; seed?: string | number };
  /** グループの名前。同じ名前が続く間を1つのグループにし、上に見出しを出す。 */
  group?: string;
  /** 薄く出す（登録済み・シフトなし）。 */
  off?: boolean;
}

export interface ArListProps {
  /** 項目（並びは製品が決める）。 */
  items: readonly ArListItem[];
  /** 一覧の名前（読み上げ）。 */
  label: string;
  /** 枠で囲む（角丸12・線）。 */
  bordered?: boolean;
  /** 項目がないときの文。 */
  emptyText?: string;
  /** 高さの上限（px）。超えるとスクロールし、グループの見出しは上に残る。 */
  maxHeight?: number;
  /** 大きさ。sm は詰めた一覧。 */
  size?: "md" | "sm";
}

/** slot：item（{ item, index }：1行まるごと）・title・description・avatar（{ item, index }）・actions（{ item, index }：右の操作）・empty・header・footer。 */
export type ArListPart =
  | "root"
  | "header"
  | "viewport"
  | "group"
  | "group-title"
  | "items"
  | "item"
  | "avatar"
  | "meta"
  | "title"
  | "description"
  | "actions"
  | "empty"
  | "footer";
