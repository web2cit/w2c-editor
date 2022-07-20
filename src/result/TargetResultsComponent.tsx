import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Divider, Typography } from "@mui/material";
import { TargetResultViewer } from "./TargetResultViewer";
import {
  TemplateConfig,
  TestConfig,
  TargetResult,
  TemplatePath
} from '../types';
import { TargetResultSelector } from "./TargetResultSelector";
  
interface TargetResultsComponentProps {
  path: string;
  test: TestConfig;
  templates: TemplateConfig[];  // can we include this in the target result?
  results: TargetResult[];
}

export function TargetResultsComponent(props: TargetResultsComponentProps) {
  const { t } = useTranslation();
  
  // if outputs are ready, select preferred
  // otherwise, select nothing
  const [ selection, setSelection ] = useState<TemplatePath>('');

  function handleSelectionChange(selection: TemplatePath) {
    setSelection(selection);
  }

  const templateConfig = props.templates.filter(
    (template) => template.path === selection
  )[0];
  const result = props.results.filter(
    (result) => result.template === selection
  )[0];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1
      }}
    >
      <Typography>
      {
        t('target-result.title', {path: props.path})
      }
      </Typography>
      <TargetResultSelector
        selection={selection}
        results={props.results}
        onSelectionChange={handleSelectionChange}
      />
    {
      result && !result.preferred &&
      <Alert severity="warning" >
        The target result selected is not the preferred/default result
      </Alert>
    }
    {
      templateConfig === undefined &&
      <Alert severity="info" >
      {
        `No template configured for path ${selection}`
      }
      {
        selection === props.path &&
        <Button>Add template</Button>
        // TODO: where can a template be removed?
      }
      </Alert>
    }
    {
      result && result.output === null && 
      templateConfig !== undefined &&
      <Alert severity="warning" >
        No result has been returned using template ... because is less prioritary than the preferred template for this target
      </Alert>
    }
    {
      selection !== "" &&
      templateConfig !== undefined &&
      result && result.output !== null &&
      (
        <Box>
          <Divider />
          <TargetResultViewer
            templateConfig={templateConfig}
            testConfig={props.test}
            targetOutput={result.output}
          />
        </Box>
      )
    }
    </Box>
  )
}

const properties: TargetResultsComponentProps = {
  path: "path",
  test: {
    fields: [
      {
        name: "itemType",
        goal: undefined
      },
    ],
  },
  templates: [
    {
      path: "/article1",
      fields: [
        {
          name: "itemType",
          required: false,
          procedures: [
            {
              selections: [
                {
                  type: "citoid",
                  args: [
                    {
                      value:
                        "templates.fields.procedures.selections.args.value",
                    },
                  ],
                },
              ],
              transformations: [
                {
                  itemwise: false,
                  type: "split",
                  args: [
                    {
                      value:
                        "templates.fields.procedures.transformations.args.value",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  results: [
    {
      template: "/article1",
      preferred: true,
      output: {
        applicable: true,
        score: 100,
        fields: []
      }
    },
  ],
};