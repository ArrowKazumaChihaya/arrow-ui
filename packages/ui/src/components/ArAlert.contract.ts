/** ArAlert 1.0 の契約。 */
export interface ArAlertProps {
  tone?: "info" | "ok" | "warn" | "danger";
  title?: string;
  closable?: boolean;
  closeLabel?: string;
}
