import React, { useEffect, useState } from "react";
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
import { selectTargetByPath } from "../app/targetsSlice";
import { useAppSelector } from "../app/hooks";
  
interface TargetResultsComponentProps {
  path: string;
  // test: TestConfig;
  // templates: TemplateConfig[];  // can we include this in the target result?
  // results: TargetResult[];
}

export function TargetResultsComponent(props: TargetResultsComponentProps) {
  const { t } = useTranslation();

  const [ resultSelection, setResultSelection ] = useState<TemplatePath|undefined>();

  const target = useAppSelector(
    (state) => selectTargetByPath(state, props.path)
  );

  // fixme: ok to set local state inside effect?
  useEffect(() => {
    if (
      target !== undefined &&
      target.preferredResult !== undefined &&
      resultSelection === undefined
    ) {
      setResultSelection(target.preferredResult);
    }
  }, [target, resultSelection, setResultSelection]);

  if (target === undefined) {
    return (
      <>
      {
        `Could not find target for path ${props.path} in app's state`
      }
      </>
    )
  }
  
  function handleSelectionChange(selection: TemplatePath) {
    setResultSelection(selection);
  }

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
        selection={resultSelection}
        results={target.results}
        onSelectionChange={handleSelectionChange}
      />
    {/* {
      result && !result.preferred &&
      <Alert severity="warning" >
        The target result selected is not the preferred/default result
      </Alert>
    } */}
    {/* {
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
    } */}
      <Box>
        <Divider />
        {
          resultSelection && <TargetResultViewer
          path={props.path}
          template={resultSelection}            
        />
        } 
      </Box>
    </Box>
  )
}
