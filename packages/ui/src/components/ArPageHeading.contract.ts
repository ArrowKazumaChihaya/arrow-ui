/** ArPageHeading 1.0 — page family colour comes from ArThemeScope. */
export interface ArPageHeadingProps {
 title?: string;
 type?: 'bar' | 'text';
 level?: 1 | 2 | 3;
}
export type ArPageHeadingPart = 'root' | 'label' | 'suffix';
