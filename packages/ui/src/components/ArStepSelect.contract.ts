/** ArStepSelect 1.0 の契約。段階式の選択と道しるべ（書類集計の「種類 › 書類 › 年月 › 人数」の箱と矢印、済み・今・次、上の道しるべの札）。 */
export interface ArStepSelectStep {
  /** 段の名前（slot の名前にも使う：step-<key>・extra-<key>）。 */
  key: string;
  /** 箱の見出し（「書類の種類を選択してください」）。 */
  title: string;
  /** 選び終わったか。済みは丸の中がチェック（緑）。最初の済みでない段が「今」になる。 */
  done?: boolean;
  /** 状態を決めて渡す（省くと done から決める）。 */
  status?: "done" | "current" | "next";
  /** 見出しの横の数の札（「2店舗」）。 */
  count?: string;
  /** 道しるべの札の小さな名前（「種類」「対象年月」）。 */
  crumbLabel?: string;
  /** 道しるべの札の値（「給与関連」「2026年10月」）。渡した段だけ札を出す。 */
  crumbValue?: string;
}
export interface ArStepSelectProps {
  steps: ArStepSelectStep[];
  /** 上に道しるべの札を出す（札が2つ以上のとき）。 */
  crumbs?: boolean;
  /** 段の間に「下へ進む」矢印を出す。 */
  connectors?: boolean;
  /** 読み上げの文言。 */
  labels?: { crumbs?: string; done?: string; current?: string };
}
export interface ArStepSelectEmits {
  /** 道しるべの札を押したとき（その段へ戻る）。箱へは自動でスクロールしてフォーカスする。 */
  jump: [key: string];
}
/** slot：step-<key>（段の中身）、extra-<key>（見出しの右：検索・件数・ボタン）。 */
export type ArStepSelectPart = "root" | "crumbs" | "crumb" | "crumb-label" | "separator" | "connector" | "step" | "head" | "marker" | "title" | "count" | "extra" | "body";
