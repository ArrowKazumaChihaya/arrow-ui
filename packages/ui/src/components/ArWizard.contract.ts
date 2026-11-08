/** A numbered workflow. The consumer owns validation and navigation. */
export interface ArWizardOption {
  value: number;
  label: string;
  isPrev?: boolean;
  isNext?: boolean;
  prevText?: string;
  nextText?: string;
  /** Semantic intent for this step’s final action; navigation steps keep the theme colour. */
  nextIntent?: "add" | "edit" | "delete";
}
export interface ArWizardProps {
  value: number;
  options: readonly ArWizardOption[];
  /** Actual destination when the consumer skips optional steps; navigation remains consumer-owned. */
  nextValue?: number;
  disabled?: boolean;
  /** Keep back navigation available while the current step is incomplete. */
  nextDisabled?: boolean;
  /** form は読みやすい幅で中央に配置。fluid は従来どおり配置先の全幅を使う。 */
  layout?: "fluid" | "form";
  /** nextStep may contain {step}; an explicit option.nextText still takes precedence. */
  labels?: { steps: string; prev: string; next: string; nextStep?: string };
  scrollOnChange?: boolean;
}
export interface ArWizardEmits { prev: []; next: []; }
export type ArWizardPart = 'root' | 'steps' | 'summary' | 'content' | 'actions';
