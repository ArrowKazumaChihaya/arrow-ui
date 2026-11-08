import type { ArDescriptionsItem } from "./ArDescriptions.contract";
import type { ArTagProps } from "./ArTag.contract";
import type { ArPaletteName } from "@s_and_a/arrow-ui-tokens";

/** Employee identity, metadata and actions share one responsive surface in both designs. */
export interface ArProfileCardProps {
  /** compact keeps the identity, metadata and actions together above a detail page. */
  layout?: "default" | "compact";
  title?: string;
  name?: string;
  kana?: string;
  code?: string;
  image?: string;
  /** 写真を押して編集を始める。編集の権限と保存は利用側が管理する。 */
  photoEditable?: boolean;
  photoLabel?: string;
  items?: readonly ArDescriptionsItem[];
  tags?: readonly { key: string; label: string; tone?: ArTagProps["tone"]; palette?: ArPaletteName }[];
  tagsLabel?: string;
}
/** Slots: actions (edit/navigation), photo-actions, footer; none own business logic. */
export type ArProfileCardPart = "root" | "summary" | "header" | "identity" | "photo" | "name" | "actions" | "footer";
