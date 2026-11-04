/** ArUpload 1.1 の契約。 */
import type { ArIconName } from "../icons";

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
/**
 * ArUpload 1.1 の契約。
 * 1.1：今の Upload（trigger="button"）と同じく、選んだあとはボタンを「ファイルを変更」、下を「選択中: 名前」に。ボタンのアイコンを選べる（buttonIcon）。
 *
 * デザインが選ぶ形（ArDesign.forms.ArUpload）。値の受け渡し（select・reject・remove）はどの形でも同じ。
 * - `trigger`：`"drop"`（既定）＝置き場（点線の枠）とファイルの一覧。`"button"`＝「ファイルを選択」のボタンと、その下に選んだファイルの名前（なければ「ファイル未選択」）（今の ARROW の Upload）。listType="text" のときだけ効く。
 */
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
  /** trigger="button" のときのボタンの種類（今の ARROW の Upload の type：add→primary、cancel→muted）。 */
  buttonTone?: "primary" | "secondary" | "muted";
  /** trigger="button" のときのボタンのアイコン（今の Upload の icon）。null で出さない。既定 upload。 */
  buttonIcon?: ArIconName | null;
  /** trigger="button" のときのボタンの大きさ（xl＝今の ARROW の xlarge）。 */
  buttonSize?: "md" | "xl";
  /** 置き場の下の説明（例：「.xlsx・10MBまで」）。 */
  hint?: string;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「シフトの Excel」）。 */
  label?: string;
  labels?: {
    drop: string;
    or: string;
    pick: string;
    add: string;
    remove: string;
    retry: string;
    tooLarge: string;
    wrongType: string;
    /** trigger="button" のボタンの文字。 */
    choose?: string;
    /** trigger="button" で、まだ何も選んでいないときの文字。 */
    none?: string;
    /** trigger="button" で、選んだあとのボタンの文字（既定「ファイルを変更」。今の component.upload.change）。 */
    change?: string;
    /** trigger="button" で、選んだファイルの名前の前の文字（既定「選択中: 」。今の component.upload.selected_file）。 */
    selected?: string;
  };
}
export interface ArUploadEmits {
  /** 選んだ・置いたファイルのうち、accept と maxSize に合うもの。 */
  select: [files: File[]];
  /** 合わなかったファイルと理由。 */
  reject: [items: { file: File; reason: string }[]];
  /** 一覧のごみ箱を押した。 */
  remove: [file: ArUploadFile];
}
export type ArUploadPart = "root" | "button" | "chosen" | "drop" | "icon" | "title" | "hint" | "pick" | "files" | "file" | "name" | "status" | "bar" | "card";
