import { Button, Card, CardContent, Checkbox, FormControlLabel, Stack, Tooltip } from "@mui/material";
import React from "react";
import { useTranslation } from 'react-i18next';
import {
  TemplateFieldConfig,
  TemplateFieldOutput
} from '../types';
import { camelToKebabCase } from '../utils';
import { TranslationProcedureCard } from '../procedure/TranslationProcedure';

interface TemplateFieldComponentProps {
  config: TemplateFieldConfig;
  output: TemplateFieldOutput | undefined;
  editable?: boolean;
}

export function TemplateFieldComponent(props: TemplateFieldComponentProps) {
  const { t } = useTranslation();
  props = {
    editable: true,
    ...props
  }

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
                      'translation-field.name.' + camelToKebabCase(props.config.name)
                    )
                  }
                ) :
                t('template-field.tooltip.required')
              }
            >
              <Checkbox
                checked={mandatory || props.config.required}
                disabled={mandatory || !props.editable}
              />
            </Tooltip>
          }
          label={t('template-field.required')}
        />
        <Stack spacing={1}>
        {
          props.config.procedures.map((procedure, index) => (
            <TranslationProcedureCard
              key={index}
              fieldname={props.config.name}  // will move to context?
              config={procedure}
              output={props.output?.procedures[index]}
              index={index}
              last={index === props.config.procedures.length - 1}
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
