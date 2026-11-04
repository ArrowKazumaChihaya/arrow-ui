/** ArViewOptions 1.1 の契約。表示内容の選択（表やカレンダーに出すものをチェックで選ぶプルダウン。ボタンに「6/7」）。 */
import type { ArIconName } from "../icons";

/** 項目の右に出す、画面での見え方の見本（凡例）。色は画面の見た目に合わせて製品が渡す。 */
export interface ArViewOptionSample {
  /** 見本の文字（「不足1」「● 朝礼」「4名」）。 */
  text?: string;
  /** 見本のアイコン（ロック中の lock・非公開の eyeoff）。 */
  icon?: ArIconName;
  /** 地（色か、斜線などの background の値）。 */
  background?: string;
  /** 文字とアイコンの色。 */
  color?: string;
  /** 枠（box-shadow の値。「inset 0 0 0 1px #E6EBF0」など）。 */
  ring?: string;
}

export interface ArViewOption {
  /** 選んだときに v-model に入る値。 */
  key: string;
  /** 太字の名前（「不足」）。 */
  label: string;
  /** 下の1行の説明（「下の行：募集人数に足りない人数」）。 */
  description?: string;
  /** 右の見本。 */
  sample?: ArViewOptionSample;
  /** 選べない（いつも出すものなど）。 */
  disabled?: boolean;
}

export interface ArViewOptionGroup {
  /** まとまりの見出し（「店舗・日ごと（人数・不足・イベント）」）。省くと見出しなし。 */
  label?: string;
  options: readonly ArViewOption[];
}

/** 名前をつけて保存した組み合わせ（製品が API で保存し、読み込んで渡す）。 */
export interface ArViewOptionPreset {
  key: string;
  /** 名前（「店長の見方」「会社の既定」）。 */
  label: string;
  /** 出すものの key の並び。 */
  keys: readonly string[];
  /** company＝会社で共有（全員に出す）、personal＝自分だけ。 */
  scope: "company" | "personal";
  /** 会社の既定（初めて開く人・まだ選んでいない人に使う組み合わせ）。名前の右に「既定」。 */
  default?: boolean;
  /** 右に × を出し、押すと delete-preset（消してよい人だけ true にする）。 */
  deletable?: boolean;
}

/** save-preset で渡すもの。 */
export interface ArViewOptionPresetDraft {
  label: string;
  scope: "company" | "personal";
  /** 今選んでいる key の並び。 */
  keys: string[];
  /** 「会社の既定として保存」を押した。 */
  asDefault: boolean;
}

export interface ArViewOptionsProps {
  /** 出すものの key の並び（v-model）。 */
  modelValue: readonly string[];
  /** 選べるもの（見出しごとのまとまり）。 */
  groups: readonly ArViewOptionGroup[];
  /** ボタンの文字（「表示内容」「カレンダーに表示」）。 */
  label?: string;
  /** プルダウンの上の見出し（「テーブルに出すもの」）。 */
  title?: string;
  /** 開いているか（v-model:open。渡さなければ中で持つ）。 */
  open?: boolean;
  /** 出す向き。表の下に置くときは top-start（上に開く）。 */
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  /** プルダウンの幅（px）。 */
  width?: number;
  disabled?: boolean;
  /**
   * 保存した組み合わせ（1.1）。渡すとプルダウンの上に並べ、押すとその組み合わせにする（update:modelValue と apply）。
   * 今の選び方と同じ組み合わせには印を付ける。部品は保存しない（ブラウザーにも書かない）。保存・読み込みは製品が API でする。
   */
  presets?: readonly ArViewOptionPreset[];
  /**
   * 保存できる範囲（1.1）。company を入れると下に「会社の既定として保存」、どちらかを入れると「名前をつけて保存」（名前の欄と、範囲ごとの保存のボタン）。
   * 押すと save-preset を出すだけ（製品が API で保存して presets を変える）。省くと保存の操作は出さない。
   */
  saveScopes?: readonly ("company" | "personal")[];
  /** 下のボタンと、保存した組み合わせまわりの文字。 */
  labels?: {
    all: string;
    close: string;
    presets?: string;
    company?: string;
    personal?: string;
    default?: string;
    saveDefault?: string;
    defaultName?: string;
    saveAs?: string;
    name?: string;
    saveCompany?: string;
    savePersonal?: string;
    cancel?: string;
    delete?: string;
  };
}
export interface ArViewOptionsEmits {
  "update:modelValue": [keys: string[]];
  "update:open": [open: boolean];
  /** 保存した組み合わせを押した（update:modelValue も出す）。 */
  apply: [preset: ArViewOptionPreset];
  /** 保存の操作を押した。 */
  "save-preset": [draft: ArViewOptionPresetDraft];
  /** 保存した組み合わせの × を押した。 */
  "delete-preset": [preset: ArViewOptionPreset];
}
export type ArViewOptionsPart =
  | "root"
  | "trigger"
  | "icon"
  | "label"
  | "count"
  | "caret"
  | "panel"
  | "title"
  | "group"
  | "group-title"
  | "option"
  | "box"
  | "text"
  | "description"
  | "sample"
  | "foot"
  | "presets"
  | "presets-title"
  | "preset"
  | "preset-apply"
  | "preset-label"
  | "preset-scope"
  | "preset-default"
  | "preset-delete"
  | "save"
  | "save-form"
  | "save-actions"
  | "preset-check";
