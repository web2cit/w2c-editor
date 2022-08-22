export interface ConfigMetadata {
  revisions: ConfigRevision[];
  revid: number | undefined;  // currently shown revision
  changed: boolean;
}

export interface ConfigRevision {
  id: number;
  timestamp: string;
}

export interface FieldOutputValue {
  value: string;
  valid: boolean;
}

// export type Score = number | null;  // we need undefined for pending output
export type TemplatePath = string | null;

//
export interface Target {
  path: string;
  pattern: string | null;
  results: TargetResult[];  // priority order
  preferredResult: TemplatePath | undefined;  // needed?
}

export interface TargetResult {
  template: TemplatePath;
  // preferred: boolean;  // consider removing
  output: (
    TargetOutput | 
    null |  // no output will be returned using this (?) template
    undefined  // the output is not ready yet
  );
}
export interface TargetOutput {
  fields: TargetFieldOutput[];
  // do we need these two or can we get them on the fly?
  applicable: boolean;
  score: number | null;
}

export interface TargetFieldOutput {
  name: string;
  template?: TemplateFieldOutput;
  test?: TestFieldOutput;
}

// todo: consider renaming PatternConfig etc as PatternDefinition (as in core)
// todo: consider having a separate type for catch-all pattern
export interface PatternConfig {
  pattern: string;
  label?: string;
}

// 
export interface CatchallPatternConfig {
  pattern: string;
}

// template config
export interface TemplateConfig {
  path: string;
  label?: string;
  fields: TemplateFieldConfig[];
}

export interface FallbackTemplateConfig {
  path: null;
  fields: TemplateFieldConfig[];
}

export interface TemplateFieldConfig {
  name: string;
  required: boolean;
  procedures: ProcedureConfig[];
}

export interface ProcedureConfig {
  selections: SelectionConfig[];
  transformations: TransformationConfig[];
}

export interface SelectionConfig extends StepConfig {};

export interface TransformationConfig extends StepConfig {
  itemwise: boolean;
}
export interface StepConfig {
  type: string;
  args: StepArgument[]
}

interface StepArgument {
  value: string;
  error?: Error;
}

// template output
export interface TemplateFieldOutput {
  name: string;
  values: FieldOutputValue[];
  applicable: boolean;
  procedures: ProcedureOutput[];
}

export interface ProcedureOutput {
  selections: StepOutput[];
  transformations: StepOutput[];
}

export interface StepOutput {
  values: string[];  // is there empty output if error?
  error?: Error;
}

//
export interface TestConfig {
  path: string;
  fields: TestFieldConfig[];
}

export interface TestFieldConfig {
  name: string;
  goal: FieldOutputValue[] | undefined;
}

export interface TestFieldOutput {
  name: string;
  score: number;
}