import { classicTokens } from "@s_and_a/arrow-ui/product";
import type { DesignTokens } from "@s_and_a/arrow-ui/product";
import type { ArDesign } from "@s_and_a/arrow-ui/design";
export function createProductTokens(design: ArDesign): DesignTokens {
const { tokens: library, palettes } = design;
return {
  ...classicTokens,
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
