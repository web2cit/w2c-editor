export interface OutputValue {
  value: string;
  valid?: boolean;
}


export interface TemplateField {
  fieldname: string;
  required: boolean;
  procedures: TranslationProcedure[];
}
export interface TranslationProcedure {
  selections: SelectionStep[];
  transformations: TransformationStep[];
}

export interface SelectionStep extends TranslationStep {};

export interface TransformationStep extends TranslationStep {
  itemwise: boolean;
}

interface TranslationStep {
  type: string;
  args: StepArgument[];
  output: string[];
  error?: Error;
}

interface StepArgument {
  value: string;
  error?: Error;
}