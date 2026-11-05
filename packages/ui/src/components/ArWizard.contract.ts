/** A numbered workflow. The consumer owns validation and navigation. */
export interface ArWizardOption {
  value: number;
  label: string;
  isPrev?: boolean;
  isNext?: boolean;
  prevText?: string;
  nextText?: string;
}
export interface ArWizardProps {
  value: number;
  options: readonly ArWizardOption[];
  /** Actual destination when the consumer skips optional steps; navigation remains consumer-owned. */
  nextValue?: number;
  disabled?: boolean;
  /** nextStep may contain {step}; an explicit option.nextText still takes precedence. */
  labels?: { steps: string; prev: string; next: string; nextStep?: string };
  scrollOnChange?: boolean;
}
export interface ArWizardEmits { prev: []; next: []; }
export type ArWizardPart = 'root' | 'steps' | 'summary' | 'content' | 'actions';
