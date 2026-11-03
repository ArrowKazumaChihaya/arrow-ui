/**
 * ARROW UI のトークン。
 * 名前はライブラリが決め、値はデザインのライブラリが決める。部品の CSS と製品のレイアウト層は名前だけを使う。
 * CSS 変数は `--ar-<名前の . を - に>`（例：color.text → --ar-color-text）。
 */
export const tokenNames = [
  // 意味の色（役割で名前を付ける）
  "color.text",
  "color.text-secondary",
  "color.text-muted",
  "color.text-faint",
  "color.border",
  "color.border-subtle",
  "color.field",
  "color.surface",
  "color.surface-alt",
  "color.bg",
  "color.hover",
  "color.overlay",
  "color.danger",
  "color.danger-ink",
  "color.danger-subtle",
  "color.warn",
  "color.warn-subtle",
  "color.warn-line",
  "color.ok",
  "color.ok-subtle",
  "color.sun",
  "color.sat",
  "color.event",
  "color.event-subtle",
  // 文字
  "font.family",
  "font.family-numeric",
  "font.size-caption",
  "font.size-label",
  "font.size-body",
  "font.size-control",
  "font.size-heading",
  "font.size-title",
  "font.weight-regular",
  "font.weight-strong",
  // 余白の段階（どこでどれを使うかは製品のレイアウト層が決める）
  "space.1",
  "space.2",
  "space.3",
  "space.4",
  "space.5",
  "space.6",
  "space.7",
  "space.8",
  // 角丸・影・大きさ・動き（部品の中で使う）
  "radius.chip",
  "radius.control",
  "radius.cell",
  "radius.card",
  "shadow.card",
  "shadow.pop",
  "shadow.modal",
  "size.control-sm",
  "size.control-md",
  "size.control-lg",
  "motion.fast",
] as const;

export type ArTokenName = (typeof tokenNames)[number];
export type ArTokenValues = Record<ArTokenName, string>;

/** 余白の段階。レイアウト用の部品はこの段階しか受け取らない。 */
export const spaceSteps = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
export type ArSpace = (typeof spaceSteps)[number];

/**
 * テーマ色の組。ライブラリはページ名（シフト・勤怠…）を知らない。
 * どのページにどの組を当てるかは製品が決める。
 */
export const paletteNames = ["blue", "green", "yellow", "pink", "orange", "teal", "amber"] as const;
export type ArPaletteName = (typeof paletteNames)[number];

/** 1つの組が持つ値。部品は accent 系の名前だけを使う。 */
export const paletteSlots = [
  "accent",
  "accent-strong",
  "accent-hi",
  "accent-ink",
  "accent-faint",
  "accent-subtle",
  "accent-muted",
  "accent-line",
  "accent-ring",
  "on-accent",
  "on-accent-shadow",
] as const;
export type ArPaletteSlot = (typeof paletteSlots)[number];
export type ArPalette = Record<ArPaletteSlot, string>;

export function cssVar(name: ArTokenName | ArPaletteSlot): string {
  return `--ar-${name.replaceAll(".", "-")}`;
}

export function cssValue(name: ArTokenName | ArPaletteSlot): string {
  return `var(${cssVar(name)})`;
}

/** 値の組から CSS の宣言（`--ar-x: v;` の並び）を作る。足りない名前があれば例外。 */
export function toDeclarations<K extends string>(names: readonly K[], values: Record<K, string>): string {
  const missing = names.filter((n) => typeof values[n] !== "string" || values[n] === "");
  if (missing.length) throw new Error(`トークンの値がありません: ${missing.join(", ")}`);
  return names.map((n) => `${cssVar(n as ArTokenName)}:${values[n]}`).join(";");
}

/** #RRGGBB 同士を混ぜる（t = a の割合）。デザインのライブラリがテーマ色の段階を作るのに使う。 */
export function mixHex(a: string, t: number, b: string): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const x = p(a);
  const y = p(b);
  return (
    "#" +
    x
      .map((v, i) => Math.round(v * t + (y[i] ?? 0) * (1 - t)))
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

/** 基本の色と文字の色から、テーマ色の組を作る。 */
export function derivePalette(base: string, ink: string, onAccentShadow = "none"): ArPalette {
  const n = parseInt(base.slice(1), 16);
  const rgb = `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  return {
    accent: base,
    "accent-strong": mixHex(base, 0.86, "#000000"),
    "accent-hi": mixHex(base, 0.78, "#FFFFFF"),
    "accent-ink": ink,
    "accent-faint": mixHex(base, 0.04, "#FFFFFF"),
    "accent-subtle": mixHex(base, 0.09, "#FFFFFF"),
    "accent-muted": mixHex(base, 0.2, "#FFFFFF"),
    "accent-line": mixHex(base, 0.4, "#FFFFFF"),
    "accent-ring": `rgba(${rgb},.24)`,
    "on-accent": "#FFFFFF",
    "on-accent-shadow": onAccentShadow,
  };
}
