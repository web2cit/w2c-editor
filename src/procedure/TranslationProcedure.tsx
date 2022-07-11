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
import { SelectionStep, TransformationStep } from '../types';
import { camelToKebabCase } from '../utils';
import ListItemActions from '../ListItemActions';
import TranslationStep from './TranslationStep';
import SelectionConfig from './SelectionConfig';
import TransformationConfig from './TransformationConfig';

interface TranslationProcedureCardProps {
  fieldname: string;
  selections: SelectionStep[];
  transformations: TransformationStep[];
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
          props.selections.map((selection, index) => {
            const stepConfig = (
              <SelectionConfig
                fieldname={props.fieldname}
                type={selection.type}
                args={selection.args}
              />
            );
            return (
              <TranslationStep
                fieldname={props.fieldname}
                stepConfig={stepConfig}
                output={selection.output}
                error={selection.error}
                first={index === 0}
                last={index === props.selections.length - 1}
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
          props.transformations.map((transformation, index) => {
            const stepConfig = (
              <TransformationConfig
                fieldname={props.fieldname}
                type={transformation.type}
                args={transformation.args}
                itemwise={transformation.itemwise}
              />
            );
            return (
              <TranslationStep
                fieldname={props.fieldname}
                stepConfig={stepConfig}
                output={transformation.output}
                error={transformation.error}
                first={index === 0}
                last={index === props.selections.length - 1}
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
