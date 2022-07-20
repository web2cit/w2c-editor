import React from "react";
import { useTranslation } from 'react-i18next';
import { 
  Button, 
  Stack
} from "@mui/material";
import { TargetFieldComponent } from '../field/TargetField';
import {
  TargetOutput,
  TemplateConfig,
  TemplateFieldConfig,
  TemplateFieldOutput,
  TestConfig,
  TestFieldConfig,
  TestFieldOutput,
} from '../types';
  
interface TargetResultViewerProps {
  templateConfig: TemplateConfig;
  testConfig: TestConfig;
  targetOutput: TargetOutput | undefined;
  // editableTemplate: boolean  // selectedTemplate && currentTarget
  // editableTest: boolean  // currentTarget
}

interface TargetResultField {
  name: string;
  template: {
    config: TemplateFieldConfig;
    // undefined outputs mean loading
    output: TemplateFieldOutput | undefined;
  };
  test: {
    config: TestFieldConfig;
    output: TestFieldOutput | undefined;
  }
}
  
export function TargetResultViewer(props: TargetResultViewerProps) {
  const { t } = useTranslation();
  
  const fieldnames = Array.from(new Set([
    ...props.templateConfig.fields.map((field) => field.name),
    ...props.testConfig.fields.map((field) => field.name)
  ]));

  const fields: TargetResultField[] = fieldnames.map((fieldname) => {
    const outputField = props.targetOutput && props.targetOutput.fields.filter(
      (field) => field.name === fieldname
    )[0];
    return {
      name: fieldname,
      template: {
        config: props.templateConfig.fields.filter(
          (field) => field.name === fieldname
        )[0],
        output: outputField && outputField.template
      },
      test: {
        config: props.testConfig.fields.filter(
          (field) => field.name === fieldname
        )[0],
        output: outputField && outputField.test
      }
    }
  })

  return (
    <Stack
      spacing={1}
    >
    {
      fields.map((field) => (
        <TargetFieldComponent
          name={field.name}
          templateConfig={field.template.config}
          templateOutput={field.template.output}
          testConfig={field.test.config}
          testOutput={field.test.output}
        />
      ))
    }
      <Button>
      {
        t('target-result.add-field')
      }
      </Button>
    </Stack>
  )
}