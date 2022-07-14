export interface OutputValue {
  value: string;
  valid?: boolean;
}

export interface FieldResult {
  fieldname: string;
  translation: FieldTranslation;
  goal: FieldGoal;
  template: FieldTemplate
}

export interface FieldTranslation {
  values: OutputValue[];
  applicable: boolean;
}

export interface FieldGoal {
  values: OutputValue[];
  score: number | undefined;
}

export interface FieldTemplate {
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