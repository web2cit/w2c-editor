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
  TemplatePath,
  TestConfig,
  TestFieldConfig,
  TestFieldOutput,
} from '../types';
import { useAppSelector } from "../app/hooks";
import { selectFallbackTemplate, selectTemplateByPath } from "../app/templatesSlice";
import { selectTargetResultByPathAndTemplate } from "../app/targetsSlice";
import { selectTestsByPath } from "../app/testsSlice";
  
interface TargetResultViewerProps {
  path: string;
  template: TemplatePath;
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
    // todo: consider defining this elsewhere; we also use it in TemplateRow
    (state) => {
      if (props.template === null) {
        return selectFallbackTemplate(state);
      } else {
        return selectTemplateByPath(state, props.template)
      }
    }
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

  if (template === undefined) {
    throw new Error(`Unexpected undefined template for path ${props.template}`);
  }
  if (result === undefined) {
    return (
      <>
      {
        `Error: Could not find translation result for target ${props.path} using \
        template for path ${props.template} in app's state.`
      }
      </>
    );
  }
  
  return (
    <Stack
      spacing={1}
    >
    {
      result.output?.fields.map((field) => {
        const name = field.name;
        const templateConfig = (
          template.fields.find((field) => field.name === name) ??
          {
            name,
            procedures: [],
            required: false
          }
        );
        const testConfig = (
          test?.fields.find((field) => field.name === name) ??
          {
            name,
            goal: undefined
          }
        );

        return <TargetFieldComponent
          name={name}
          key={name}
          templateConfig={templateConfig}
          templateOutput={field.template}
          testConfig={testConfig}
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