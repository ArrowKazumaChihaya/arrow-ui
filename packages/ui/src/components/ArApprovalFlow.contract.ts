import type { ArIconName } from "../icons";

/**
 * ArApprovalFlow 1.2 の契約。承認の流れ（設定の申請設定・勤怠の承認・社員情報の申請）。
 * 段ごとに 済み（done）・あなたの番／いまの番（current）・まだ（todo）・差し戻し（denied）・飛ばした（skipped）。
 * デザインが選べる形（ArDesign.forms.ArApprovalFlow）：
 * - list："list"（既定。layout="list" をそのまま縦の一覧で）／"row"（list も横の札で出す。今の ARROW の AdmitFlowView は横に並んだ丸い札と「→」だけ。classic）。
 */
export type ArApprovalState = "done" | "current" | "todo" | "denied" | "skipped" | "blocked";

export interface ArApprovalStep {
  /** 見分ける値（省くと順番）。 */
  key?: string | number;
  /** 段の名前（「店長の承認」「人事部」）。 */
  title: string;
  /** 承認する人（「末永 修也」「千速 一真（あなた）」）。 */
  who?: string;
  /** 状態。 */
  state: ArApprovalState;
  /** 状態の札の文字（省くと状態ごとの既定。done に日時を足すなら「承認済　10/31 18:02」）。 */
  status?: string;
}

export interface ArApprovalFlowLabels {
  done: string;
  current: string;
  todo: string;
  denied: string;
  skipped: string;
  /** 承認者不足などで進行できない状態。否認・差し戻しとは区別する。 */
  blocked: string;
  /** 流れの名前（読み上げ）。 */
  flow: string;
}

export interface ArApprovalFlowProps {
  /** 段。並んでいる順に承認する。 */
  steps: readonly ArApprovalStep[];
  /**
   * 形。row＝横に並んだ丸い札を ›（→）でつなぐ（設定の承認フロー .cf-flow。step スロットでセレクトに差し替えて編集もできる）。
   * list＝番号の丸・段の名前と承認する人・状態の札を縦に並べる（勤怠・社員情報の承認の画面）。
   */
  layout?: "row" | "list";
  /** row の先頭の札（「申請」）。省くと出さない。 */
  start?: string;
  /** 先頭の札のアイコン。 */
  startIcon?: ArIconName;
  /** 状態の札の既定の文字と読み上げ。 */
  labels?: Partial<ArApprovalFlowLabels>;
}

/**
 * slot：step（{ step, index }：段の札を差し替える（両layoutで同じDOMを保持）。編集の画面ではここに ArSelect を置く）、
 * details（{ step, index }：共通の題名・状態を保ったまま候補者・履歴・補助操作を追加する。両layoutで同じDOMを保持）、
 * append（row の最後の › の後ろ。「ステップを足す」のボタン）。
 */
export type ArApprovalFlowPart = "root" | "item" | "start" | "step" | "sep" | "mark" | "body" | "title" | "who" | "status" | "append" | "details";
