/** ArUpload 1.0 の契約。 */
export interface ArUploadFile {
  /** 一覧の中で一意な値。 */
  id: string | number;
  name: string;
  /** done：済み。uploading：送っている途中（percent を出す）。error：失敗（error に理由）。 */
  status: "done" | "uploading" | "error";
  /** 0〜100。 */
  percent?: number;
  /** 失敗の理由（例：「形式が違います」）。 */
  error?: string;
  /** 写真の見本（listType="picture"）。 */
  url?: string;
}
export interface ArUploadProps {
  /** 一覧に出すファイル。送る処理は親が行い、状態をここに入れる。 */
  files?: readonly ArUploadFile[];
  /** 受けるファイルの種類（input の accept と同じ。例：".xlsx"）。合わないものは reject で返す。 */
  accept?: string;
  /** 1つのファイルの上限（バイト）。越えたものは reject で返す。 */
  maxSize?: number;
  multiple?: boolean;
  /** text：置き場とファイルの一覧（Excel登録）。picture：96px の四角（写真）。 */
  listType?: "text" | "picture";
  /** 置き場の下の説明（例：「.xlsx・10MBまで」）。 */
  hint?: string;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「シフトの Excel」）。 */
  label?: string;
  labels?: { drop: string; or: string; pick: string; add: string; remove: string; retry: string; tooLarge: string; wrongType: string };
}
export interface ArUploadEmits {
  /** 選んだ・置いたファイルのうち、accept と maxSize に合うもの。 */
  select: [files: File[]];
  /** 合わなかったファイルと理由。 */
  reject: [items: { file: File; reason: string }[]];
  /** 一覧のごみ箱を押した。 */
  remove: [file: ArUploadFile];
}
export type ArUploadPart = "root" | "drop" | "icon" | "title" | "hint" | "pick" | "files" | "file" | "name" | "status" | "bar" | "card";
