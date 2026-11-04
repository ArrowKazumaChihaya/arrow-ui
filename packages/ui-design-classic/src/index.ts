/**
 * classic — 今の ARROW の見た目のデザインライブラリ。
 * 今の画面（ant-design-vue 4 の既定に、ARROW の色・ボタン・表・タイトルの帯・灰色のタブを重ねたもの）に合わせる。
 * 今の画面にない部品（日付の曜日・表の固定列や合計・ポップアップの手順など）は、同じ雰囲気で作る。
 * 参考：docs/reference/current-*.png（ARROW_front の実際の部品を描いたもの）。
 * 全画面を新しい部品へ移し、remix を全社に出したら、このパッケージごと外して廃止する。
 */
import { defineDesign } from "@arrow/ui/design";
import { covers } from "./covers.generated.js";
import { classicIcons } from "./icons.js";
import { derivePalette, mixHex, type ArPalette } from "@arrow/ui-tokens";

/** 今のページの色（section-*）と、押したときの明るい色（section-*-hover）。 */
const section = (base: string, hover: string, ink = mixHex(base, 0.72, "#000000")): ArPalette => ({
  ...derivePalette(base, ink),
  "accent-hi": hover,
});

export const classicDesign = defineDesign({
  id: "classic",
  label: "ARROW（今の見た目）",
  deprecated: "移行中だけ使う。全画面の移行と remix の全社公開のあとに廃止する。",
  tokens: {
    "color.text": "rgba(0,0,0,.88)",
    "color.text-secondary": "rgba(0,0,0,.65)",
    "color.text-muted": "rgba(0,0,0,.45)",
    "color.text-faint": "rgba(0,0,0,.25)",
    "color.border": "#D9D9D9",
    "color.border-subtle": "#E8E8E8",
    "color.field": "#D9D9D9",
    "color.surface": "#FFFFFF",
    "color.surface-alt": "#FAFAFA",
    "color.bg": "#FFFFFF",
    "color.hover": "#F5F5F5",
    "color.overlay": "rgba(0,0,0,.45)",
    "color.danger": "#CA3A31",
    "color.danger-ink": "#CF1322",
    "color.danger-subtle": "#FFF2F0",
    "color.warn": "#D46B08",
    "color.warn-subtle": "#FFFBE6",
    "color.warn-line": "#FFE58F",
    "color.ok": "#389E0D",
    "color.ok-subtle": "#F6FFED",
    "color.sun": "#D10C1D",
    "color.sat": "#1677FF",
    "color.event": "#722ED1",
    "color.event-subtle": "#F9F0FF",
    "font.family": "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Hiragino Kaku Gothic ProN',Meiryo,sans-serif",
    "font.family-numeric": "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif",
    "font.size-caption": "12px",
    "font.size-label": "14px",
    "font.size-body": "14px",
    "font.size-control": "14px",
    "font.size-heading": "16px",
    "font.size-title": "18px",
    "font.weight-regular": "400",
    "font.weight-strong": "600",
    "space.1": "4px",
    "space.2": "8px",
    "space.3": "12px",
    "space.4": "16px",
    "space.5": "20px",
    "space.6": "24px",
    "space.7": "28px",
    "space.8": "32px",
    "radius.chip": "4px",
    "radius.control": "6px",
    "radius.cell": "6px",
    "radius.card": "5px",
    "shadow.card": "none",
    "shadow.pop": "0 6px 16px 0 rgba(0,0,0,.08),0 3px 6px -4px rgba(0,0,0,.12),0 9px 28px 8px rgba(0,0,0,.05)",
    "shadow.modal": "0 6px 16px 0 rgba(0,0,0,.08),0 3px 6px -4px rgba(0,0,0,.12),0 9px 28px 8px rgba(0,0,0,.05)",
    "size.control-sm": "24px",
    "size.control-md": "32px",
    "size.control-lg": "40px",
    "motion.fast": ".2s",
  },
  palettes: {
    blue: section("#4395D4", "#56AEEC", "#4F92C2"), // シフト（文字は今のリンクの色）
    green: section("#4EB187", "#5ECF9A"), // 勤怠
    yellow: section("#D1AA00", "#E0C000"), // 給与賞与報酬年調
    amber: section("#EE751B", "#F58F3A"), // 集計
    pink: section("#E389B7", "#E89FCF"), // 書類
    orange: section("#EB9142", "#EFA35F"), // 通知
    teal: section("#6CB1B7", "#7CC4CA"), // 会社情報・社員情報・設定
  },
  covers,
  forms: {
    ArTimeInput: { fields: "split", dayToggle: "link" }, // 時と分が別々の箱と「:」、前日は「当／前」の文字のリンク（今の ui-Time）
    ArSelect: { search: "off" }, // 今の Select はプルダウンに探す欄がない
    ArDateInput: { invalidDate: "message", pad: "zero", yearEmpty: "option", yearOrder: "desc" }, // 今の Dates：ありえない日は「無効な日付」、月日は2桁、年は新しい順で先頭に「未選択」
    ArUpload: { trigger: "button" }, // 今の Upload は「ファイルを選択」のボタンと、その下のファイル名（置き場はない）
    ArColorPicker: { panel: "dialog", palette: "arrow" }, // 今の Colorpicker は真ん中のダイアログ「色選択」で選ぶ。色は 12色×濃さ4段（縦に4色ずつ）
    ArProgress: { stepsInfo: "percent" }, // antd の Progress の刻みは右に「60%」
    ArSkeleton: { title: "line" }, // antd の Skeleton は行の上に幅半分の見出しの行がある
    ArNotificationHost: { order: "newest-last" }, // antd の notification は新しいものを下に足す
    ArTour: { nextCount: "none" }, // antd の Tour の「次へ」に数は付かない
    ArMentions: { popup: "caret" }, // antd の Mentions：候補は打っている「@」の右下に、中身の幅（最小100px）で出る
    ArModal: { buttonText: "antd" }, // 足のボタンは antd の Button：2 文字の漢字・かなは「登 録」と間を空ける（今の ui-Modal）
    ArCalendar: { firstDay: "always" }, // 今の Calendar は 1 日をいつも「11/1」「12/1」と月を添えて書く（期間の外の日も）
    ArThumbnail: { editor: "arrow" }, // 今の画像のアップロード：大きな「ファイルを選択」・ファイル名・左右の回すボタン・真ん中の大きな「登録」
    ArTreeTable: { toggle: "box" }, // 今の TreeTable は antd の Tree（showLine）：開け閉めは四角の中の −／＋
    ArSaveBar: { summary: "hidden", buttonText: "arrow" }, // 今の設定：変えると「キャンセル」「実行」のボタンだけが並ぶ（件数・項目名はない）
    ArApprovalFlow: { list: "row" }, // 今の承認フロー（AdmitFlowView）は横に並んだ丸い札と「→」だけ
    ArPeriodBox: { layout: "nav" }, // 今の募集・一括登録の期間：テーマ色の点線の箱に MonthChanger と「月／半月」「(前半)／(後半)」のボタン型ラジオ、箱の下に大きな「適用」と /img/apply.png の矢印
    ArTable: { selectHead: "label", dragHandle: "cell", groupToggle: "menu" }, // 今の SelectTable：見出しのチェックの左に「全選択」。今の SortableTable：並べ替えの ⠿ は1列目のセルの頭。まとまりを開くのは Th の isToggle（menu の絵）
    ArPunchButton: { icons: "punch" }, // 今の MyPC 打刻：出勤・退勤は人の大きな絵（punch_in・punch_out）、休憩は絵なし
    ArOtpInput: { fields: "single" }, // 今のログインの認証コードは1つの欄（maxlength 6・placeholder 000000）
    ArRichTextEditor: { variables: "menu", icons: "froala", variableButton: "icon", count: "footer" }, // 今の Froala：ARROW の印のボタンからまとまりのメニュー、Froala の塗りの絵、文字数はいつも下の段
    ArVariablePanel: { search: "off" }, // 今の変数のメニュー（Froala）に探す欄はない
    ArPdfViewer: { bar: "pager" }, // 今の PdfViewer：PDF の上の真ん中に「‹ 1 / 5 ›」だけ（大きさ・何人目はない）、PDF は黒い1pxの枠
    ArTimeChart: { tick: "60" }, // 今の勤怠の月のチャート（MonthlyChart）は1時間ごとの線と時刻
    ArShiftChart: { counts: "spans", bar: "icon", avatar: "balloon", axis: "number", summary: "count", legend: "editing" }, // 今のシフトチャート（Calendar/Chart/Daily.vue）：必要人数・不足人数の帯の行、バーの真ん中に人の絵、吹き出しの丸、下に「9」「10」…、右下に「当店舗のシフト人数」
    ArShiftGrid: { head: "button", fit: "scale", cell: "fill", tip: "section", hint: "text", summary: "paren" }, // 今のテーブルタブ（Weekly・Monthly）：1段目は日付だけ・2段目に「名前」とシフトチャートのボタン、週と月は枠の幅まで縮める、マスはパターン色の塗り、吹き出しは見出しの下に時刻、「コピー: ⌘+C」の文字
    ArShiftViewTable: { chip: "labeled", time: "padded", dayHead: "inline", summary: "days", fill: "fixed", columnWidth: "136", nameWidth: "136" }, // 今の閲覧タブ：灰色の札の右上に店舗名・「シフト」・「09:00〜18:00」、見出しは「16 (金)」、名前の下は「勤務 n日」、列は 136px ちょうど
  },
  icons: classicIcons, // 今の ARROW の塗りの絵（public/icons）。ここに無い名前は線のアイコン
  styles: () => import("@arrow/ui-design-classic/styles.css"),
});

export default classicDesign;
