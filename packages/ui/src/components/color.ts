/** 色の計算（ArColorPicker の中身）。 */
export interface Hsv {
  h: number;
  s: number;
  v: number;
}

/** "#RGB" "#RRGGBB" "RRGGBB" を "#RRGGBB" に整える。読めなければ null。 */
export function normalizeHex(text: string): string | null {
  let s = text.normalize("NFKC").trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(s)) s = s.replace(/./g, (c) => c + c);
  return /^[0-9a-f]{6}$/i.test(s) ? `#${s.toUpperCase()}` : null;
}

export function hexToHsv(hex: string): Hsv {
  const n = parseInt((normalizeHex(hex) ?? "#000000").slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: max ? d / max : 0, v: max };
}

export function hsvToHex({ h, s, v }: Hsv): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255);
  };
  return `#${[f(5), f(3), f(1)].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

/** イベント・パターンの決まった色（ARROW デザインシステムの .sws と同じ）。 */
export const arEventColors: readonly { value: string; label: string }[] = [
  { value: "#8E6BC4", label: "紫" },
  { value: "#2F6BDA", label: "青" },
  { value: "#2E9A6B", label: "緑" },
  { value: "#D6A20F", label: "黄" },
  { value: "#D2457A", label: "桃" },
  { value: "#E06A3E", label: "橙" },
  { value: "#2A9BB0", label: "青緑" },
  { value: "#6E6866", label: "灰" },
];

/** 今の ARROW の Colorpicker（「色選択」のダイアログ）の色：12の色 × 濃さ4段（縦に4色ずつ）。 */
export const arArrowColors: readonly { value: string; label: string }[] = [
  ["#E03838", "#E66464", "#ED9090", "#F4BCBC"],
  ["#FF6666", "#FF7F7F", "#FF9999", "#FFB2B2"],
  ["#E91E63", "#ED4A83", "#F178A2", "#F6A6C2"],
  ["#BA37D1", "#C861DB", "#D78AE4", "#E5B4EE"],
  ["#7146C3", "#8F6CCF", "#AC93DC", "#CAB9E8"],
  ["#495DBF", "#6F7FCC", "#95A0D9", "#BBC2E7"],
  ["#2196F3", "#51AEF4", "#81C4F7", "#B1DBFA"],
  ["#449B47", "#5BB75F", "#7FC781", "#A2D6A4"],
  ["#B0BD22", "#CDDC39", "#D7E263", "#E2EA8E"],
  ["#E5CE00", "#FFE819", "#FFED4C", "#FFF27F"],
  ["#E58500", "#FF9F19", "#FFB44C", "#FFC97F"],
  ["#A1582A", "#C96E35", "#D48B5D", "#DEA886"],
]
  .flat()
  .map((value) => ({ value, label: value }));
