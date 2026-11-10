import type { ArIconName } from "../icons";
/** Shared sign-in/reset shell. The consumer owns credentials, authentication and routing. */
export interface ArAuthPanelProps {
  title: string;
  icon?: ArIconName;
  logo?: string;
  logoAlt?: string;
  companyName?: string;
  companyCode?: string;
  companyCodeLabel?: string;
  companyIcon?: ArIconName;
  /** 見出しを見た目にも出す（remix は既定で読み上げ用だけ。2段階認証の題など、画面の中身を示すときに true）。 */
  showHeading?: boolean;
}
export type ArAuthPanelPart =
  "root" | "logo" | "card" | "heading" | "company" | "company-name" | "company-code" | "body" | "footer";
