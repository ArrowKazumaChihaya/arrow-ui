/**
 * ArItem 1.1 の契約。設定の画面などの「項目の1行」：左に項目名（幅 titleWidth）、右に入力と補足。
 * 今の ARROW の Item（ui-Item）にあたる。
 * 1.1 で、区切りの線つきの行（variant="row"：社員情報・会社情報・設定の行）、？の説明（help）、項目名の下の補足（caption）、
 * 間違い（error）、「未登録」の札（unregistered）、「変更あり」と「元に戻す」（changed・revert）、探して移った行の光り（highlight）を足した。
 */
export interface ArItemProps {
  /** 項目名。改行（\n）はそのまま改行する。title スロットでも渡せる。 */
  title?: string;
  /** 必須の印を出す（今の ARROW の isNeed）。 */
  required?: boolean;
  /** 必須の印の文字（読み上げにも使う）。 */
  requiredText?: string;
  /** 入力の下に出す補足の文字（info スロットでも渡せる）。 */
  info?: string;
  /** 補足の後ろに「詳細」を出す。押すと detail を出す（説明のポップアップを開くなど）。 */
  detail?: boolean;
  /** 「詳細」をリンクにする（別のページの説明へ）。 */
  detailHref?: string;
  /** 「詳細」の文字。 */
  detailText?: string;
  /** 項目名の幅（CSS の長さ）。長い項目名（「シフトテーブルに勤務時間と日数を表示」など）は 230px・236px などに広げる。 */
  titleWidth?: string;
  /** 入力の id（省くと自動）。default スロットの値で入力に渡す。 */
  id?: string;
  /**
   * 形。form＝線のない入力の行（ポップアップ・入力の画面。今までの形）。
   * row＝上に区切りの線がある行（社員情報・会社情報・設定の画面の「項目名｜値＋説明」。右に「変更あり／元に戻す」の欄）。
   */
  variant?: "form" | "row";
  /** 項目名の右の「？」で開く説明の文。押すと吹き出しで出し、help も出す。 */
  help?: string;
  /** 「？」の読み上げの名前（省くと「<項目名>の説明」）。 */
  helpLabel?: string;
  /** 項目名の下の小さな補足（「登録するとマイページのシフトで表示名が…」）。 */
  caption?: string;
  /** 間違いの文（直し方まで書く）。入力の下に赤で出し、入力に aria-invalid を付ける。 */
  error?: string;
  /**
   * 値がまだ登録されていない。true で「未登録」、文字を渡すとその横に理由の札（「源泉徴収票・法定調書合計表に必要です」）。
   * 値の代わりに出す（default スロットは出さない）。
   */
  unregistered?: boolean | string;
  /** 「未登録」の文字。 */
  unregisteredText?: string;
  /** 保存していない変更がある。行を淡いテーマ色にし、右に「変更あり」と「元に戻す」を出す。 */
  changed?: boolean;
  /** 「変更あり」の文字。 */
  changedText?: string;
  /** 「元に戻す」を出す（changed のとき）。押すと revert を出す。 */
  revertable?: boolean;
  /** 「元に戻す」の文字。 */
  revertText?: string;
  /** 探して移ってきた行を光らせる（設定を探す）。 */
  highlight?: boolean;
}
export interface ArItemEmits {
  /** 「詳細」を押した。 */
  detail: [event: MouseEvent];
  /** 「？」を押した。 */
  help: [event: MouseEvent];
  /** 「元に戻す」を押した。 */
  revert: [event: MouseEvent];
}
/** default スロットに渡す値。中の入力に v-bind する。 */
export interface ArItemControlProps {
  id: string;
  "aria-labelledby": string;
  "aria-describedby"?: string;
  "aria-required"?: "true";
  "aria-invalid"?: "true";
}
export type ArItemPart =
  | "root"
  | "title"
  | "label"
  | "label-text"
  | "required"
  | "help"
  | "caption"
  | "content"
  | "unregistered"
  | "unregistered-text"
  | "unregistered-why"
  | "error"
  | "info"
  | "info-text"
  | "detail"
  | "aside"
  | "changed";
