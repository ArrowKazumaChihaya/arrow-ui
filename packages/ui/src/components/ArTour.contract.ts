import type { ArPlacement } from "../internal/floating";

/** 案内の1つ。 */
export interface ArTourStep {
  /** 指す要素：CSS セレクタ・要素・要素を返す関数。なければ画面の中ほどにカードだけ出す。 */
  target?: string | HTMLElement | (() => HTMLElement | null) | null;
  title: string;
  description?: string;
  /** カードを置く向き（既定 bottom-start）。入らなければ反対へ返す。 */
  placement?: ArPlacement;
}

/** ArTour 1.0 の契約。初めての人への案内（周りは暗い幕、説明は白いカード、今の点はテーマ色）。 */
export interface ArTourProps {
  steps: readonly ArTourStep[];
  /** 出しているか（v-model:open）。 */
  open: boolean;
  /** 今の番号（0 から、v-model:current）。渡さなければ中で持つ。 */
  current?: number;
  /** 周りを暗くする。false なら幕なし（指す要素の枠だけ）。 */
  mask?: boolean;
  /** 指す要素の周りの余白（px）。 */
  gap?: number;
  /** 右上に閉じるボタンを出す（Escape はいつでも閉じる）。 */
  closable?: boolean;
  /** 画面の文字。next は「次へ（2/3）」の形で数が付く。 */
  labels?: { prev: string; next: string; finish: string; close: string };
}
export interface ArTourEmits {
  "update:open": [open: boolean];
  "update:current": [index: number];
  /** 最後の「完了」を押したとき。 */
  finish: [];
  /** 閉じたとき（Escape・閉じるボタン・完了）。 */
  close: [];
}
export type ArTourPart = "overlay" | "spot" | "root" | "panel" | "arrow" | "close" | "title" | "description" | "footer" | "dots" | "dot" | "actions";
