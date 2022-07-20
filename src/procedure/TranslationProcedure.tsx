import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack
} from "@mui/material";
import React from "react";
import { useTranslation } from 'react-i18next';
import {
  ProcedureConfig,
  ProcedureOutput
} from '../types';
import { camelToKebabCase } from '../utils';
import ListItemActions from '../ListItemActions';
import TranslationStep from './TranslationStep';
import SelectionConfigComponent from './SelectionConfig';
import TransformationConfigComponent from './TransformationConfig';

interface TranslationProcedureCardProps {
  fieldname: string;  // will move to context?
  config: ProcedureConfig;
  output: ProcedureOutput | undefined;
  index: number;
  last?: boolean;
}

export function TranslationProcedureCard(props: TranslationProcedureCardProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader
        title={t('translation-procedure.label', { index: props.index })}
        action={
          <ListItemActions
            keyPrefix="translation-procedure"
            first={props.index === 0}
            last={props.last}
            editable={true}
          />
        }
      />
      <CardContent
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between"
        }}
      >
        <Stack
          spacing={1}
          sx={{ flex: 1 }}
        >
        {
          props.config.selections.map((selection, index) => {
            const stepConfig = (
              <SelectionConfigComponent
                fieldname={props.fieldname}
                type={selection.type}
                args={selection.args}
              />
            );
            const output = props.output?.selections[index];
            return (
              <TranslationStep
                fieldname={props.fieldname}
                stepConfig={stepConfig}
                output={output}
                first={index === 0}
                last={index === props.config.selections.length - 1}
              />
            );
          })
        }
          <Button variant="contained" >
          {
            t('translation-procedure.add-selection')
          }
          </Button>
        </Stack>
        <Divider orientation="vertical" flexItem />
        <Stack
          spacing={1}
          sx={{ flex: 1 }}
        >
        {
          props.config.transformations.map((transformation, index) => {
            const stepConfig = (
              <TransformationConfigComponent
                fieldname={props.fieldname}
                type={transformation.type}
                args={transformation.args}
                itemwise={transformation.itemwise}
              />
            );
            const output = props.output?.transformations[index];
            return (
              <TranslationStep
                fieldname={props.fieldname}
                stepConfig={stepConfig}
                output={output}
                first={index === 0}
                last={index === props.config.selections.length - 1}
              />
            );
          })
        }
          <Button variant="contained" >
          {
            t('translation-procedure.add-selection')
          }
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
