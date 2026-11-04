/**
 * ArShiftDaySheet 1.0 の契約。スマホで日の詳細を下から出す画面（シート）。
 * ArDrawer の placement="bottom" の中に、シフトのキャンバスの RxSpDay と同じ並びで
 * 「右上の ×／前の日・10月21日 水・次の日／日の要約の札（人件費・公開中など）／中身（勤務メンバー・表示内容・勤務可能な人）」を置く。
 * 中身（勤務メンバーの表やチャート）は default slot に製品が置く（ArSectionHead・ArTable・F4 のチャートなど）。
 */
import type { ArDaySummaryItem } from "./ArDaySummary.contract";

export interface ArShiftDaySheetProps {
  /** 開いているか（v-model:open）。 */
  open: boolean;
  /** 日付（「10月21日」）。 */
  label: string;
  /** 曜日の札（「水」）。 */
  weekday?: string;
  /** 曜日の札の色。sun＝日曜・祝日、sat＝土曜。 */
  weekdayTone?: "sun" | "sat";
  /** 日付の下の要約の札（ArDaySummary の items：人件費・勤怠ロック・不足など）。 */
  summary?: readonly ArDaySummaryItem[];
  /** 公開の切り替えの札（v-model:published）。undefined なら出さない。 */
  published?: boolean;
  /** 公開の札を押せなくする。 */
  publishDisabled?: boolean;
  /** 前の日・次の日を押せなくする（月の端など）。 */
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  /** シートの高さ（px か CSS の長さ）。省くと calc(100% - 60px)（キャンバスと同じく上に 60px あけ、ヘッダーのロゴとお知らせが見える高さ）。 */
  height?: number | string;
  /** 画面全体ではなく親の要素（position:relative）の中に出す（見本・スマホの枠の中）。 */
  contained?: boolean;
  /** 出す先。null にするとその場に出す。 */
  teleportTo?: string | null;
  /** 重なりの順（z-index）。 */
  zIndex?: number;
  /** 読み上げの名前。title はシートの題（省くと「シフト詳細」。remix では読み上げだけ、classic では antd の Drawer の題として見える）。 */
  labels?: { title?: string; prev?: string; next?: string; close?: string };
}

export interface ArShiftDaySheetEmits {
  "update:open": [open: boolean];
  /** 閉じた（×・幕・Esc）。 */
  close: [];
  /** 前の日へ。 */
  prev: [];
  /** 次の日へ。 */
  next: [];
  /** 公開の札を押した（次の値）。 */
  "update:published": [value: boolean];
}

/** slot：default（日の要約の下の中身）、footer（シートの足）。 */
export type ArShiftDaySheetPart = "root" | "body";
