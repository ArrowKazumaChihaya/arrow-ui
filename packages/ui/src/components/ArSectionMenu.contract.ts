import type { ArMenuItem } from './ArMenu.contract';
/** Responsive section navigation. Item keys also identify sections in scroll mode. */
export interface ArSectionMenuProps {
 items: readonly ArMenuItem[];
 value?: string;
 label?: string;
 scroll?: boolean;
 scrollOffset?: number;
}
export interface ArSectionMenuEmits { 'update:value': [value:string]; }
export type ArSectionMenuPart = 'root' | 'navigation' | 'desktop' | 'mobile' | 'content';
