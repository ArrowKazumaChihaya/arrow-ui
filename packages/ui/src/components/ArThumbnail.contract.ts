/**
 * デザインが選べる形（ArDesign.forms.ArThumbnail）：
 * - editor："tools"（既定。枠の下に －＋・左右に回す・画像を選ぶ・消す、足にキャンセルと登録）／"arrow"（今の ARROW の画像のアップロード：
 *   幅500、「ファイルを選択」の大きなボタンの下に選んだファイルの名前、左右の端に回すボタン、真ん中に大きな「登録」。キャンセルは × で閉じる）。
 */
/**
 * ArThumbnail 1.1 の契約。顔写真などの画像と、変えるためのカメラのボタン・切り抜きのポップアップ（今の ARROW の Thumbnail）。
 * 1.1：今の Thumbnail の呼び方に合わせて、ポップアップの開け閉めを製品が持つ（v-model:open＝今の isEditting・updateIsEditting）、
 * ポップアップだけ（dialogOnly）、切り抜く範囲を自由に変える（freeCrop。結果は file で PNG の File＝今の updateFile）、
 * 受け付ける拡張子（accept＝今の allowedExtension）、画像のないときの絵（placeholder＝今の silhouette）、
 * 画面の箱を切り抜く比に合わせる（aspect＝今の社員カードの 300×189）を足した。
 */
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
  /** ポップアップを開いているか（v-model:open。今の isEditting）。省くと部品の中で持つ（カメラのボタンで開く）。 */
  open?: boolean;
  /** 画像とカメラのボタンを出さず、ポップアップだけ（今の dialogOnly。添付の「写真を追加」のボタンから開く）。 */
  dialogOnly?: boolean;
  /**
   * 切り抜く範囲を自由に変える（今の freeCrop）。画像全体を枠に入れ、四隅のつまみで範囲を変え、中をドラッグで動かす。
   * 「登録」で、範囲を元の画素のまま PNG にした File を file で渡す（modelValue は変えない）。
   */
  freeCrop?: boolean;
  /** 受け付ける拡張子（今の allowedExtension。例：["jpg","jpeg","png"]）。合わないものは invalid-image（"type"）。省くと png・jpeg・gif。 */
  accept?: readonly string[];
  /** 画像のないときの絵。person＝人の形（既定）、picture＝写真の絵（今の silhouette="picture"。不具合の報告の画面のキャプチャー）。 */
  placeholder?: "person" | "picture";
  /** 画面の箱の形。square＝size の正方形（既定）、crop＝幅 size で、高さを cropWidth:cropHeight の比にする（社員カードの 300×189）。 */
  aspect?: "square" | "crop";
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
  /** 「登録」を押したとき。切り抜いた PNG の data URL（画像を消したなら null）。freeCrop では出さない。 */
  "update:modelValue": [value: string | null];
  /** ポップアップを開いた・閉じた（v-model:open）。 */
  "update:open": [open: boolean];
  /** freeCrop の「登録」：切り抜いた範囲の PNG（名前は元のファイルの名前で拡張子を .png に）。 */
  file: [file: File];
  /** 読めない・大きすぎる画像を選んだとき。 */
  "invalid-image": [reason: "type" | "bytes" | "pixels" | "load"];
}
export type ArThumbnailPart = "root" | "image" | "silhouette" | "camera" | "editor" | "hint" | "frame" | "picture" | "empty" | "tools" | "file" | "submit" | "crop" | "crop-handle";
