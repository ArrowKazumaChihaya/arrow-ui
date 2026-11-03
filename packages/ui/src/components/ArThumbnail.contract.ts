/**
 * デザインが選べる形（ArDesign.forms.ArThumbnail）：
 * - editor："tools"（既定。枠の下に －＋・左右に回す・画像を選ぶ・消す、足にキャンセルと登録）／"arrow"（今の ARROW の画像のアップロード：
 *   幅500、「ファイルを選択」の大きなボタンの下に選んだファイルの名前、左右の端に回すボタン、真ん中に大きな「登録」。キャンセルは × で閉じる）。
 */
/** ArThumbnail 1.0 の契約。顔写真などの画像と、変えるためのカメラのボタン・切り抜きのポップアップ（今の ARROW の Thumbnail）。 */
export interface ArThumbnailProps {
  /** 画像（data URL か URL）。無ければ人の形の絵を出す。v-model。 */
  modelValue: string | null;
  /** 形。circle：丸（顔写真）。square：四角（今の ARROW と同じ）。 */
  shape?: "circle" | "square";
  /** 画面での大きさ（px）。既定 120。 */
  size?: number;
  /** 変えられる（右下にカメラのボタン。今の isValid）。 */
  editable?: boolean;
  /** 切り抜いて出す画像の幅・高さ（px）。既定 300×300。 */
  cropWidth?: number;
  cropHeight?: number;
  /** 出す画像の倍率（今の quality。顔写真は 5 など）。 */
  quality?: number;
  /** 最初の合わせ方。contain：全体が入る（余白は白）。cover：枠いっぱい。 */
  fit?: "contain" | "cover";
  /** 受け付けるファイルの大きさの上限（バイト）。 */
  maxFileBytes?: number;
  /** 受け付ける画像の画素数の上限（幅×高さ）。 */
  maxImagePixels?: number;
  /** 画像の説明（読み上げ）。 */
  alt?: string;
  labels?: {
    /** editor="arrow" の、まだファイルを選んでいないときの文字（既定「ファイル未選択」）。 */
    noFile?: string;
    change: string;
    title: string;
    hint: string;
    choose: string;
    remove: string;
    zoomIn: string;
    zoomOut: string;
    rotateLeft: string;
    rotateRight: string;
    area: string;
    cancel: string;
    ok: string;
    empty: string;
  };
}
export interface ArThumbnailEmits {
  /** 「登録」を押したとき。切り抜いた PNG の data URL（画像を消したなら null）。 */
  "update:modelValue": [value: string | null];
  /** 読めない・大きすぎる画像を選んだとき。 */
  "invalid-image": [reason: "type" | "bytes" | "pixels" | "load"];
}
export type ArThumbnailPart = "root" | "image" | "silhouette" | "camera" | "editor" | "hint" | "frame" | "picture" | "empty" | "tools" | "file" | "submit";
