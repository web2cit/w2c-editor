import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, IconButton, Stack, Tooltip } from "@mui/material";
import { Delete, Help } from '@mui/icons-material';
import React from "react";
import { useTranslation } from 'react-i18next';
import TemplateFieldOutput from './TemplateFieldOutput';
import TestFieldOutput from './TestFieldOutput';
import { TranslationProcedure } from '../types';
import { camelToKebabCase } from '../utils';
import { TranslationProcedureCard } from '../procedure/TranslationProcedure';

interface TemplateFieldComponentProps {
  fieldname: string;  // should be controlled?
  required: boolean;
  procedures: TranslationProcedure[]
}

export function TemplateFieldComponent(props: TemplateFieldComponentProps) {
  const { t } = useTranslation();
  const mandatory = false;
  return (
    <Card>
      <CardContent>
        <FormControlLabel
          control={
            <Tooltip
              title={
                mandatory ?
                t(
                  'template-field.tooltip.mandatory',
                  { 
                    fieldname: t(
                      'translation-field.name.' + camelToKebabCase(props.fieldname)
                    )
                  }
                ) :
                t('template-field.tooltip.required')
              }
            >
              <Checkbox
                checked={mandatory || props.required}
                disabled={mandatory}
              />
            </Tooltip>
          }
          label={t('template-field.required')}
        />
        <Stack spacing={1}>
        {
          props.procedures.map((procedure, index) => (
            <TranslationProcedureCard
              fieldname={props.fieldname}
              selections={procedure.selections}
              transformations={procedure.transformations}
              index={index}
              last={index === props.procedures.length - 1}
            />
          ))
        }
        <Button
          variant="contained"
        >
        {
          t('template-field.add-procedure')
        }
        </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
