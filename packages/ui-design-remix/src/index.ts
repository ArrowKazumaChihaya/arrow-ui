/**
 * remix — ARROW リミックスの見た目。
 * 落ち着いた青を基本に、ページごとのテーマ色・やわらかい帯・角丸10の部品。テーマ色の上の文字はすべて白。
 */
import { defineDesign } from "@arrow/ui/design";
import { covers } from "./covers.generated";
import { derivePalette } from "@arrow/ui-tokens";

export const remixDesign = defineDesign({
  id: "remix",
  label: "ARROW リミックス",
  tokens: {
    "color.text": "#1F2933",
    "color.text-secondary": "#4A5562",
    "color.text-muted": "#66727F",
    "color.text-faint": "#A3AEB9",
    "color.border": "#E6EBF0",
    "color.border-subtle": "#F0F3F6",
    "color.field": "#CBD5DF",
    "color.surface": "#FFFFFF",
    "color.surface-alt": "#F8FAFC",
    "color.bg": "#EEF2F6",
    "color.hover": "#F2F5F8",
    "color.overlay": "rgba(31,41,51,.42)",
    "color.danger": "#C0322B",
    "color.danger-ink": "#B02D27",
    "color.danger-subtle": "#FCEBEA",
    "color.warn": "#8A4F00",
    "color.warn-subtle": "#FFF1DB",
    "color.warn-line": "#E8B66B",
    "color.ok": "#1E7A4C",
    "color.ok-subtle": "#E6F3EC",
    "color.sun": "#C8322B",
    "color.sat": "#2563C9",
    "color.event": "#8E6BC4",
    "color.event-subtle": "#F1EBFA",
    "font.family": "'Noto Sans JP','Hiragino Sans','Hiragino Kaku Gothic ProN',Meiryo,sans-serif",
    "font.family-numeric": "'Noto Sans JP','Hiragino Sans',sans-serif",
    "font.size-caption": "11.5px",
    "font.size-label": "12.5px",
    "font.size-body": "13.5px",
    "font.size-control": "14px",
    "font.size-heading": "16px",
    "font.size-title": "18px",
    "font.weight-regular": "400",
    "font.weight-strong": "700",
    "space.1": "4px",
    "space.2": "8px",
    "space.3": "12px",
    "space.4": "16px",
    "space.5": "20px",
    "space.6": "24px",
    "space.7": "28px",
    "space.8": "32px",
    "radius.chip": "5px",
    "radius.control": "10px",
    "radius.cell": "12px",
    "radius.card": "18px",
    "shadow.card": "0 1px 2px rgba(31,41,51,.06),0 10px 30px -12px rgba(31,41,51,.12)",
    "shadow.pop": "0 18px 44px rgba(31,41,51,.18),0 0 0 1px rgba(31,41,51,.06)",
    "shadow.modal": "0 24px 60px rgba(31,41,51,.28)",
    "size.control-sm": "30px",
    "size.control-md": "36px",
    "size.control-lg": "42px",
    "motion.fast": ".15s",
  },
  // テーマ色：ARROW デザインシステムの th-shift・th-att・th-pay・th-doc・th-notice・th-admin と同じ値
  palettes: {
    blue: { "accent": "#5591CE", "accent-ink": "#2C6AA6", "on-accent": "#fff", "accent-hi": "#7AA9D9", "accent-strong": "#497DB1", "accent-faint": "#F8FBFD", "accent-subtle": "#F0F5FB", "accent-muted": "#DDE9F5", "accent-line": "#BBD3EB", "accent-ring": "rgba(85,145,206,.24)", "on-accent-shadow": "none" },
    green: { "accent": "#4EB187", "accent-ink": "#387F61", "on-accent": "#fff", "accent-hi": "#75C2A1", "accent-strong": "#439874", "accent-faint": "#F8FCFA", "accent-subtle": "#EFF8F4", "accent-muted": "#DCEFE7", "accent-line": "#B8E0CF", "accent-ring": "rgba(78,177,135,.24)", "on-accent-shadow": "none" },
    yellow: { "accent": "#D1AA00", "accent-ink": "#8A7000", "on-accent": "#fff", "accent-hi": "#DBBD38", "accent-strong": "#B49200", "accent-faint": "#FDFCF5", "accent-subtle": "#FBF7E8", "accent-muted": "#F6EECC", "accent-line": "#EDDD99", "accent-ring": "rgba(209,170,0,.24)", "on-accent-shadow": "0 1px 2px rgba(80,60,0,.35)" },
    pink: { "accent": "#E389B7", "accent-ink": "#B83A7B", "on-accent": "#fff", "accent-hi": "#E9A3C7", "accent-strong": "#C3769D", "accent-faint": "#FEFAFC", "accent-subtle": "#FCF4F9", "accent-muted": "#F9E7F1", "accent-line": "#F4D0E2", "accent-ring": "rgba(227,137,183,.24)", "on-accent-shadow": "0 1px 2px rgba(90,20,55,.28)" },
    orange: { "accent": "#EB9142", "accent-ink": "#B45E13", "on-accent": "#fff", "accent-hi": "#EFA96C", "accent-strong": "#CA7D39", "accent-faint": "#FEFBF7", "accent-subtle": "#FDF5EE", "accent-muted": "#FBE9D9", "accent-line": "#F7D3B3", "accent-ring": "rgba(235,145,66,.24)", "on-accent-shadow": "0 1px 2px rgba(90,40,0,.28)" },
    teal: { "accent": "#6CB1B7", "accent-ink": "#407D82", "on-accent": "#fff", "accent-hi": "#8CC2C7", "accent-strong": "#5D989D", "accent-faint": "#F9FCFC", "accent-subtle": "#F2F8F9", "accent-muted": "#E2EFF1", "accent-line": "#C4E0E2", "accent-ring": "rgba(108,177,183,.24)", "on-accent-shadow": "0 1px 2px rgba(20,60,62,.3)" },
    // 集計：仮の色（デザインシステムにまだない。設計書の「決めること」）
    amber: derivePalette("#E07A2E", "#A9521A", "0 1px 2px rgba(90,40,0,.28)"),
  },
  covers,
  styles: () => import("@arrow/ui-design-remix/styles.css"),
});

export default remixDesign;
