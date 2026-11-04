/** ArBadge 1.1・ArRibbon 1.0 の契約。 */

/**
 * 件数の丸はライブラリの中でこれ1つ（ヘッダーのお知らせ・メニューのタイル・タブ・切り替え・札・表示内容など、ほかの部品の件数もこれで描く）。
 * remix：高さ18・角丸9・11px 700・数字は等幅。赤（tone="danger"）はデザインシステムの count の赤 #DC2525（間違い・削除のボタンの赤 danger とは別）。
 */
export interface ArBadgeProps {
  /**
   * 件数。子（アイコンのボタンなど）の右上に重ねる。子がなければその場に出す。
   * 文字（「3/10」など）も渡せる（max・showZero は数のときだけ効く）。
   */
  count?: number | string;
  /** これを超えると「99+」のように出す。 */
  max?: number;
  /** 0 でも出す。 */
  showZero?: boolean;
  /** 数を出さずに点だけ（新しいものがある）。 */
  dot?: boolean;
  /**
   * 件数・点の色。danger＝赤（お知らせ・やること・メニューの件数。remix は count の赤 #DC2525）、accent＝テーマ色、
   * neutral＝灰色、warn＝橙（未保存・未提出の件数）。
   */
  tone?: "danger" | "accent" | "neutral" | "warn";
  /**
   * 塗り方（1.1）。solid＝色の塗りに白い字（既定）、subtle＝淡い地に濃い字（タブ・表示内容・切り替えの中の件数など、文字の横に並べるとき）。
   */
  variant?: "solid" | "subtle";
  /**
   * 白い 2px の縁（1.1）。アイコンや写真の上に重ねても読めるようにする。省くと、子に重ねるときは付け、子がない（その場に出す）ときは付けない。
   */
  ring?: boolean;
  /**
   * 状態の点（出勤中・処理中・未提出・エラー）。渡すと件数ではなく「点＋言葉」の形になる。
   * ok＝緑、accent＝テーマ色（淡い輪つき＝処理中）、warn＝橙、danger＝赤、neutral＝灰色。
   */
  status?: "ok" | "accent" | "warn" | "danger" | "neutral";
  /** 状態の言葉（default slot でも渡せる）。 */
  text?: string;
  /**
   * 読み上げの名前（件数のとき）。省くと「n件」。
   * "" にすると読み上げの名前を足さず、丸の中の文字をそのまま読む（タブ・切り替えの中の数など、前後の言葉と一緒に読むとき）。
   */
  label?: string;
}

export interface ArRibbonProps {
  /** リボンの言葉（「おすすめ」）。 */
  text: string;
  /** 色。accent＝テーマ色の塗りに白文字。 */
  tone?: "accent" | "danger" | "ok" | "warn";
  /** 右上（end）か左上（start）。 */
  placement?: "end" | "start";
}

export type ArBadgePart = "root" | "count" | "dot" | "status-dot" | "text";
export type ArRibbonPart = "root" | "content" | "ribbon" | "corner";
