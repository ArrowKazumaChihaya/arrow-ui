import { normalizeStyle } from "vue";
import type { CSSProperties, StyleValue } from "vue";
const structuralProperties = new Set([
  "transform",
  "grid",
  "grid-template-columns",
  "gridTemplateColumns",
  "grid-template-rows",
  "gridTemplateRows",
  "grid-template-areas",
  "gridTemplateAreas",
  "grid-auto-flow",
  "gridAutoFlow",
  "grid-auto-columns",
  "gridAutoColumns",
  "grid-auto-rows",
  "gridAutoRows",
  "grid-column",
  "gridColumn",
  "grid-row",
  "gridRow",
  "grid-area",
  "gridArea",
  "justify-items",
  "justifyItems",
  "justify-self",
  "justifySelf",
  "align-content",
  "alignContent",
  "place-content",
  "placeContent",
  "place-items",
  "placeItems",
  "place-self",
  "placeSelf",
  "order",
  "object-fit",
  "objectFit",
  "object-position",
  "objectPosition",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "inset",
  "z-index",
  "zIndex",
  "display",
  "flex",
  "flex-direction",
  "flexDirection",
  "flex-grow",
  "flexGrow",
  "flex-shrink",
  "flexShrink",
  "flex-basis",
  "flexBasis",
  "flex-wrap",
  "flexWrap",
  "align-items",
  "alignItems",
  "align-self",
  "alignSelf",
  "justify-content",
  "justifyContent",
  "gap",
  "row-gap",
  "rowGap",
  "column-gap",
  "columnGap",
  "width",
  "min-width",
  "minWidth",
  "max-width",
  "maxWidth",
  "height",
  "min-height",
  "minHeight",
  "max-height",
  "maxHeight",
  "margin",
  "margin-top",
  "marginTop",
  "margin-right",
  "marginRight",
  "margin-bottom",
  "marginBottom",
  "margin-left",
  "marginLeft",
  "padding",
  "padding-top",
  "paddingTop",
  "padding-right",
  "paddingRight",
  "padding-bottom",
  "paddingBottom",
  "padding-left",
  "paddingLeft",
  "overflow",
  "overflow-x",
  "overflowX",
  "overflow-y",
  "overflowY",
  "overflow-wrap",
  "overflowWrap",
  "white-space",
  "whiteSpace",
  "text-align",
  "textAlign",
  "box-sizing",
  "boxSizing",
  "resize",
  "clip",
  "cursor",
  "list-style",
  "listStyle",
  "line-height",
  "lineHeight",
]);

const structuralVariables = new Set([
  '--branch-button-column-width', '--branch-code-column-width', '--branch-count-column-width',
  '--branch-name-column-width', '--first-column-width', '--map-height', '--map-width',
  '--modal-body-max-height', '--padding-index', '--remarks-table-min-width', '--scroll-height',
  '--shift-table-col-width', '--shift-table-name-text-width', '--shift-table-name-width',
  '--shift-table-row-height', '--tab-sp-width', '--tab-width', '--table-width',
]);

/** Only operation geometry may override a skin; visual declarations stay with the skin. */
export function filterStructuralLayout(layout: StyleValue): CSSProperties {
  const normalized = normalizeStyle([layout]);
  return !normalized || typeof normalized === "string"
    ? {}
    : Object.fromEntries(
        Object.entries(normalized).filter(([key, value]) =>
          key === "font"
            ? value === "inherit"
            : key === "list-style" || key === "listStyle"
              ? value === "none"
              : key !== "cursor" && (structuralProperties.has(key) || structuralVariables.has(key)),
        ),
      );
}

/** A consumer may place a control; its internal spacing and typography belong to its design. */
export function filterControlLayout(layout: StyleValue): CSSProperties {
  return Object.fromEntries(Object.entries(filterStructuralLayout(layout)).filter(([key]) => {
    const name = key.replace(/[A-Z]/g, char => '-' + char.toLowerCase());
    return !name.startsWith('padding') && ![
      'font', 'line-height', 'text-align', 'white-space', 'box-sizing', 'resize',
      'gap', 'row-gap', 'column-gap', 'flex-direction', 'justify-content', 'align-items',
    ].includes(name);
  }));
}

