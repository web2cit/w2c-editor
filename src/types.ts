export interface OutputValue {
  value: string;
  valid?: boolean;
}


interface TemplateField {
  fieldname: string;
  required: boolean;
  procedures: Procedure[];
}
export interface Procedure {
  selections: SelectionStep[];
  transformations: TransformationStep[];
}
export interface SelectionStep {
  type: string;
  config: string[];
  output: string[];
  error?: Error;
}

export interface TransformationStep {
  type: string;
  itemwise: boolean;
  config: string[];
  output: string[];
  error?: Error;
}