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
import { useAppSelector } from "../app/hooks";
import { selectTemplateByPath } from "../app/templatesSlice";
import { selectTargetResultByPathAndTemplate } from "../app/targetsSlice";
import { selectTestsByPath } from "../app/testsSlice";
  
interface TargetResultViewerProps {
  path: string;
  template: string;
  // templateConfig: TemplateConfig;
  // testConfig: TestConfig;
  // targetOutput: TargetOutput | undefined;
  // // editableTemplate: boolean  // selectedTemplate && currentTarget
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

  const template = useAppSelector(
    (state) => selectTemplateByPath(state, props.template)
  );
  const test = useAppSelector(
    (state) => selectTestsByPath(state, props.path)
  );
  const result = useAppSelector(
    (state) => selectTargetResultByPathAndTemplate(
      state,
      props.path,
      props.template
    )
  );
  
  return (
    <Stack
      spacing={1}
    >
    {
      // fixme: result!
      result!.output?.fields.map((field) => {
        const name = field.name;
        return <TargetFieldComponent
          name={field.name}
          templateConfig={template!.fields.find((field) => field.name === name)!}
          templateOutput={field.template}
          testConfig={
            test!.fields.find((field) => field.name === name) ??
            {
              name,
              goal: undefined
            }
          }
          testOutput={field.test}
        />
      })
    }
      <Button>
      {
        t('target-result.add-field')
      }
      </Button>
    </Stack>
  )
}