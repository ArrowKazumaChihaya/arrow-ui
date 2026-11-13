/**
 * ArTimeChart 1.1 の契約。時間の横棒のチャート（勤怠の月のチャート・1日のチャート）。
 * month：1行＝1日。帯（通常勤務・残業・休日勤務・休憩）と、上の細い線＝シフト、下の細い線＝深夜。日付を押すと select（その日の大きなチャート）。
 * day：1行＝1つの内容（シフト・勤務・休憩・深夜勤務）。帯の中に「18:00〜27:00」などの文字。
 * stack：1日を積み上げで出す（旧 ARROW の勤怠の1日のチャート）。縦が量、横が時間。rows の順が層の順で、先頭の行（打刻の勤務）が下の1段、2つ目から（法定外・休日・深夜の割増）が上に半段ずつ重なる。kind が shift の帯は下の細い線。休憩は帯を作らず空ける。
 * 帯に乗せると「種類・時間帯・時間数」の吹き出し。時刻は 0:00 からの分（翌日の 3:00 は 1620。前日の 23:00 は -60）。
 * デザインが選べる形（ArDesign.forms.ArTimeChart）：
 * - tick："180"（既定。3時間ごとの目盛り）／"60"（1時間ごと。今の ARROW の勤怠の月のチャート。classic）。tickStep で上書きできる。
 */
export type ArTimeChartKind =
  | "shift"
  | "work"
  | "preover"
  | "overtime"
  | "weekOver"
  | "monthOver"
  | "sixtyOver"
  | "outhol"
  | "lawhol"
  | "night"
  | "break"
  | "missing";

export interface ArTimeChartBar {
  /** 始まり（0:00 からの分）。 */
  start: number;
  /** 終わり（0:00 からの分。翌日は 1440 を足す）。 */
  end: number;
  /**
   * 種類。shift＝シフト（month は上の線）、work＝通常勤務、preover＝法定内残業、overtime＝法定外残業（weekOver 週・monthOver 月・sixtyOver 60時間超）、
   * outhol＝法定外休日勤務、lawhol＝法定休日勤務、night＝深夜（month は下の線）、break＝休憩（斜線）、missing＝打刻もれ（赤い斜線）。
   */
  kind: ArTimeChartKind;
  /** 吹き出しと帯の中の名前（省くと種類の名前）。 */
  name?: string;
  /** day の帯の中の文字（「18:00〜27:00」「深夜」）。 */
  text?: string;
  /** 時間数（分）。省くと end − start。 */
  minutes?: number;
  /** 吹き出しの文字を自分で作る（改行は \n）。 */
  tip?: string;
}

/** 同じ日・時刻に重なる独立した計算区分。各区分を別の帯にして隠さず表示する。 */
export interface ArTimeChartTrack {
  key: string;
  label: string;
  bars: readonly ArTimeChartBar[];
}

export interface ArTimeChartRow {
  key: string;
  /** 左の名前（month は「10/01」、day は「シフト」）。 */
  label: string;
  /** 曜日（0＝日〜6＝土）。日は赤・土は青で（）に出す。 */
  weekday?: number;
  /** 曜日の文字（「木」）。省くと weekday から。 */
  weekdayLabel?: string;
  /** 祝日。曜日名を保持しながら日曜と同じ色で表示する。 */
  holiday?: boolean;
  /** 名前の下・横の小さな文字（勤務形態「通常」「法定外休日」）。 */
  sub?: string;
  /** 帯がないときに帯の場所に出す文字（「勤務なし」「有給全日」）。 */
  note?: string;
  /** 行の地。holiday＝土日・祝日の淡い地、paid＝有給の斜線の地、error＝エラーの淡い赤（名前の側）。 */
  tone?: "holiday" | "paid" | "error";
  bars: readonly ArTimeChartBar[];
  /** 1.1: 区分ごとの帯。bars があれば先頭の帯に残し、tracks を後ろに並べる。空の帯も順序を保持する。 */
  tracks?: readonly ArTimeChartTrack[];
}

export interface ArTimeChartProps {
  /** month：1行＝1日（日付を押せる）。day：1行＝1つの内容。stack：1日の積み上げ（rows の順が下からの層）。 */
  mode?: "month" | "day" | "stack";
  rows: readonly ArTimeChartRow[];
  /** 横軸の範囲（分）。既定は month が [-60, 1680]（前日23時〜翌4時）、day は帯から決める（前後1時間）。 */
  range?: readonly [number, number];
  /** 目盛りの間（分）。省くとデザインの形（forms.ArTimeChart.tick）。day は 60。 */
  tickStep?: number;
  /** 左上の見出し（「日付・形態」「内容」）。 */
  headLabel?: string;
  /** 凡例を出す（true は出てくる種類だけ。並びを渡すとその種類）。 */
  legend?: boolean | readonly ArTimeChartKind[];
  /** 凡例の右の案内（「帯に乗せると時間帯と時間数が出ます」）。 */
  hint?: string;
  /** 帯の最小の幅（%。狭すぎて見えなくならないように）。 */
  minBarWidth?: number;
  /** 読み上げ用の名前。 */
  label?: string;
  /** 画面の文字。 */
  labels?: Partial<ArTimeChartLabels>;
}

export interface ArTimeChartLabels {
  kinds: Partial<Record<ArTimeChartKind, string>>;
  /** 月のチャートの凡例で、線になる種類の後ろに付ける文字。 */
  shiftLine: string;
  nightLine: string;
  range: string;
  duration: string;
  weekdays: readonly string[];
  nextDay: string;
  open: string;
}

export interface ArTimeChartEmits {
  /** month の日付を押したとき。 */
  select: [row: ArTimeChartRow];
}

export type ArTimeChartPart =
  | "root"
  | "legend"
  | "legend-item"
  | "swatch"
  | "hint"
  | "grid"
  | "head"
  | "head-label"
  | "ticks"
  | "tick"
  | "row-label"
  | "date"
  | "weekday"
  | "sub"
  | "lane"
  | "gridline"
  | "bar"
  | "bar-text"
  | "note"
  | "tip";
