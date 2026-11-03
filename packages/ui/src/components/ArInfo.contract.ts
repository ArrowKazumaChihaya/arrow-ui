/** ArInfo 1.0 の契約。小さな説明・注意の書き方（今の ARROW の Info・Attention）。 */
export interface ArInfoProps {
  /**
   * note：入力の下などに添える小さな説明（今の Info type="small"）。
   * attention：画面の頭に置く赤い注意（今の Attention）。
   * mark：？の印だけ。押すと open（説明のポップアップは製品が出す）か、href を新しいタブで開く（今の type="mark"）。
   * detail：「詳細」の小さなリンク（今の type="detail"）。
   */
  kind?: "note" | "attention" | "mark" | "detail";
  /** 言葉（default slot でもよい）。mark・detail では読み上げの名前にも使う。 */
  text?: string;
  /** mark・detail で開く先（新しいタブ）。無ければ open を出す。 */
  href?: string;
  labels?: { mark: string; detail: string };
}
export interface ArInfoEmits {
  /** mark・detail を押したとき（href が無いとき）。 */
  open: [];
}
export type ArInfoPart = "root" | "icon" | "text";
