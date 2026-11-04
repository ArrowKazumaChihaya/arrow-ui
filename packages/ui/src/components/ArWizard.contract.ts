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
  disabled?: boolean;
  labels?: { steps: string; prev: string; next: string };
  scrollOnChange?: boolean;
}
export interface ArWizardEmits { prev: []; next: []; }
export type ArWizardPart = 'root' | 'steps' | 'summary' | 'content' | 'actions';
