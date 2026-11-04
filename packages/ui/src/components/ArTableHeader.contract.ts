/** Header for product-owned table rows. Sorting and column preferences stay with the consumer. */
export interface ArTableHeaderProps {
 sortable?: boolean;
 sort?: string|null;
 toggle?: boolean;
 width?:number;
 maxWidth?:number;
 label?:string;
}
export interface ArTableHeaderEmits { activate:[]; }
export type ArTableHeaderPart='root'|'button'|'label'|'sort';
