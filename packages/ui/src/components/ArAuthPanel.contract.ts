/** Shared sign-in/reset shell. The consumer owns credentials, authentication and routing. */
export interface ArAuthPanelProps {
 title: string;
 logo?: string;
 logoAlt?: string;
 companyName?: string;
 companyCode?: string;
 companyCodeLabel?: string;
}
export type ArAuthPanelPart = 'root' | 'logo' | 'card' | 'heading' | 'company' | 'company-name' | 'company-code' | 'body' | 'footer';
