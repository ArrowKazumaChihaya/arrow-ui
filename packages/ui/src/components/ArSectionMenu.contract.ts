import type { ArIconName } from "../icons";
import type { ArMenuItem } from './ArMenu.contract';
/** Responsive section navigation. Item keys also identify sections in scroll mode. */
export interface ArSectionMenuProps {
 /** 1.1: Optional heading for the desktop navigation card. */
 title?: string;
 icon?: ArIconName;
 /** 1.1: Search labels and ancestor labels without changing the selected section or its content. */
 searchable?: boolean;
 searchPlaceholder?: string;
 emptyText?: string;
 items: readonly ArMenuItem[];
 value?: string;
 label?: string;
 scroll?: boolean;
 scrollOffset?: number;
}
export interface ArSectionMenuEmits { 'update:value': [value:string]; }
export type ArSectionMenuPart = 'root' | 'navigation' | 'desktop' | 'mobile' | 'content';
