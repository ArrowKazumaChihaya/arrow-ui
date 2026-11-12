/**
 * 色合い（利用者が選ぶ色の強さ）。標準のテーマ色から、色相を変えずに作る。
 * - vivid（あざやか）：彩度を上げ、くすみを減らす。白抜きの文字の読みやすさは標準より下げない。
 * - clear（くっきり）：テーマ色を濃くして白抜きの文字を 4.5:1 以上にし、文字・線も濃くする。
 * 部品の形・大きさは変えない（色だけ）。
 */
import { derivePalette, paletteNames, type ArPalette, type ArPaletteName } from "@s_and_a/arrow-ui-tokens";

type Hsl = [number, number, number];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1, 7), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function toHsl(hex: string): Hsl {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}

function fromHsl([h, s, l]: Hsl): string {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t: number) => {
    const x = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return rgbToHex([channel(h + 1 / 3) * 255, channel(h) * 255, channel(h - 1 / 3) * 255]);
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** 2つの色のコントラスト比（WCAG）。 */
export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

/** 明るさを下げて、背景との比が target 以上になる色にする（色相・彩度は保つ）。 */
function darkenTo(hex: string, against: string, target: number): string {
  let [h, s, l] = toHsl(hex);
  let out = hex;
  while (contrast(out, against) < target && l > 0.05) {
    l -= 0.01;
    out = fromHsl([h, s, l]);
  }
  return out;
}

function vivid(p: ArPalette): ArPalette {
  const [h, s, l] = toHsl(p.accent);
  const base = darkenTo(fromHsl([h, Math.min(1, s * 1.3 + 0.06), l]), "#FFFFFF", contrast(p.accent, "#FFFFFF"));
  const [ih, is] = toHsl(p["accent-ink"]);
  const draft = derivePalette(base, p["accent-ink"], p["on-accent-shadow"]);
  const ink = darkenTo(fromHsl([ih, Math.min(1, is * 1.25 + 0.05), toHsl(p["accent-ink"])[2]]), draft["accent-muted"], 4.5);
  return derivePalette(base, ink, p["on-accent-shadow"]);
}

function clear(p: ArPalette): ArPalette {
  const [h, s, l] = toHsl(p.accent);
  const base = darkenTo(fromHsl([h, Math.min(1, s + 0.06), l]), "#FFFFFF", 4.5);
  const draft = derivePalette(base, p["accent-ink"], "none");
  const ink = darkenTo(p["accent-ink"], draft["accent-muted"], 6);
  // 白抜きの文字が 4.5:1 を超えるので、文字の影はいらない。
  return derivePalette(base, ink, "none");
}

function each(palettes: Record<ArPaletteName, ArPalette>, f: (p: ArPalette) => ArPalette): Record<ArPaletteName, ArPalette> {
  return Object.fromEntries(paletteNames.map((name) => [name, f(palettes[name])])) as Record<ArPaletteName, ArPalette>;
}

export function remixTones(palettes: Record<ArPaletteName, ArPalette>) {
  return {
    vivid: { label: "あざやか", palettes: each(palettes, vivid) },
    clear: {
      label: "くっきり",
      tokens: {
        "color.text": "#111827",
        "color.text-secondary": "#2F3A45",
        "color.text-muted": "#4A5562",
        "color.text-faint": "#7B8794",
        "color.border": "#D3DBE3",
        "color.border-subtle": "#E3E8EE",
        "color.field": "#9AA8B6",
      },
      palettes: each(palettes, clear),
    },
  };
}
