import { classicTokens } from "@s_and_a/arrow-ui/product";
import type { DesignTokens } from "@s_and_a/arrow-ui/product";
import type { ArDesign } from "@s_and_a/arrow-ui/design";
export function createProductTokens(design: ArDesign): DesignTokens {
const { tokens: library, palettes } = design;
return {
  ...classicTokens,
  // 画面の左右の余白は詰めて広く使う（表を広く使うページと同じ 20px）。広い画面でも 1680px までにして間延びさせない。
  "content-max-width": "1680px",
  // 右だけはマスコット（右下・右端から約112px）の幅を空け、表やボタンがマスコットにかからないようにする（全ページ共通）。
  "page-padding": "26px 124px 80px 20px",
  "page-padding-wide-inline": "20px 124px",
  "page-padding-tablet": "20px 16px 86px",
  "page-padding-mobile": "16px 12px 86px",
  "color-primary": palettes.blue.accent,
  "color-link": palettes.blue["accent-ink"],
  "color-danger": library["color.danger"],
  "color-surface": library["color.surface"],
  "color-header": library["color.bg"],
  "color-text": library["color.text"],
  "color-muted": library["color.text-muted"],
  "color-border": library["color.field"],
  "section-shift": palettes.blue.accent,
  "section-attendance": palettes.green.accent,
  "section-payment": palettes.yellow.accent,
  "section-aggregation": palettes.amber.accent,
  "section-document": palettes.pink.accent,
  "section-notification": palettes.orange.accent,
  "section-other": palettes.teal.accent,
  "section-shift-hover": palettes.blue["accent-hi"],
  "section-attendance-hover": palettes.green["accent-hi"],
  "section-payment-hover": palettes.yellow["accent-hi"],
  "section-aggregation-hover": palettes.amber["accent-hi"],
  "section-document-hover": palettes.pink["accent-hi"],
  "section-notification-hover": palettes.orange["accent-hi"],
  "button-add": palettes.blue.accent,
  "button-edit": library["color.ok"],
  "button-delete": library["color.danger"],
  "button-radius": library["radius.control"],
  "card-border": library["color.border"],
  "card-radius": library["radius.card"],
  "title-radius": library["radius.control"],
  "tab-radius": `${library["radius.control"]} ${library["radius.control"]} 0 0`,
  "table-border": library["color.border"],
};

}
