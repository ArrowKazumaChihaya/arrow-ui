/** ArPageHeading 1.0 — page family colour comes from ArThemeScope. */
export interface ArPageHeadingProps {
 /** Heading text. When omitted, the default slot supplies the heading; with a title, the slot is supplementary. */
 title?: string;
 type?: 'bar' | 'text';
 level?: 1 | 2 | 3;
}
export type ArPageHeadingPart = 'root' | 'label' | 'suffix';
