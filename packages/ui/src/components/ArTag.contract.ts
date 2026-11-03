/** ArTag 1.0 の契約。 */
import type { ArIconName } from "../icons";

export interface ArTagProps {
  tone?: "neutral" | "accent" | "solid" | "ok" | "warn" | "danger" | "event";
  icon?: ArIconName;
  size?: "sm" | "md";
}
