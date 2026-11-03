/** ArChangedValue 1.0 の契約。変更前→変更後の表示（今の ARROW の ChangedValue）。 */
export interface ArChangedValueProps {
  before?: string | number | null;
  after?: string | number | null;
  /** 変わったかどうか。省くと before と after を比べる。 */
  changed?: boolean | null;
  /** 値が空のときに出す文字（既定「—」）。 */
  empty?: string;
  labels?: { before: string; after: string };
}
export type ArChangedValuePart = "root" | "before" | "arrow" | "after";
