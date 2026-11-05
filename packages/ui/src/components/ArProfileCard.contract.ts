import type { ArDescriptionsItem } from "./ArDescriptions.contract";
import type { ArTagProps } from "./ArTag.contract";

/** Employee identity, metadata and actions share one responsive surface in both designs. */
export interface ArProfileCardProps {
  /** compact keeps the identity, metadata and actions together above a detail page. */
  layout?: "default" | "compact";
  title?: string;
  name?: string;
  kana?: string;
  code?: string;
  image?: string;
  items?: readonly ArDescriptionsItem[];
  tags?: readonly { key: string; label: string; tone?: ArTagProps["tone"] }[];
  tagsLabel?: string;
}
/** Slots: actions (edit/navigation), photo-actions, footer; none own business logic. */
export type ArProfileCardPart = "root" | "summary" | "header" | "identity" | "photo" | "name" | "actions" | "footer";
