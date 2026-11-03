/** ArDateView 1.0 の契約。日付を「11月05日(木)」の形で見せる（入力ではない）。曜日は日曜・祝日が赤、土曜が青、ほかは灰色。 */
export interface ArDateViewProps {
  /** 日付（"2026-11-05" か Date）。 */
  date: string | Date;
  /** 祝日（日曜と同じ赤にする）。祝日の一覧は製品が持つ。 */
  holiday?: boolean;
  /**
   * 書き方。long＝「11月05日(木)」、short＝「11/05(木)」、
   * auto＝ふだんは long、幅 499px 以下の画面では short（今の ARROW の DateView と同じ）。
   */
  format?: "auto" | "long" | "short";
}
export type ArDateViewPart = "root" | "long" | "short" | "weekday";
