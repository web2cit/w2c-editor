import { Box, Card, CardContent, Collapse, Divider, IconButton, Tooltip } from "@mui/material";
import { ChevronRight, Delete, Help } from '@mui/icons-material';
import React from "react";
import { useTranslation } from 'react-i18next';
import TemplateFieldOutput from './TemplateFieldOutput';
import TestFieldOutput from './TestFieldOutput';
import { TemplateField, OutputValue } from './types';
import { camelToKebabCase } from './utils';
import { TemplateFieldComponent } from './TemplateField';

interface TranslationFieldComponentProps {
  fieldname: string;  // should be controlled?
  translation: {
    values: OutputValue[];
    applicable: boolean;
  };
  goal: {
    values: OutputValue[];
    score: number | undefined;
  };
  template: TemplateField;  
}

// TODO: many of the component settings within a field depend on the field type
// maybe we could create a field context
// or just pass the fieldname, and have components down in the hierarchy get what
// they need from a global configuration file
// Likewise the domain may be a higher-order context
// And the selected target (including its caches)

function TranslationFieldComponent(props: TranslationFieldComponentProps) {
  const { t } = useTranslation();
  const deletable = true;
  return (
    <Card>
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2
        }}
      >
        {/* TranslationFieldInfo */}
        <Box
          sx={{ display: "flex", flexDirection: "column"}}
        >
          {
            t('translation-field.name.' + camelToKebabCase(props.fieldname))
          }
          <Box
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            {/* Shall we automatically hide empty fields instead? */}
            <Tooltip
              title={
                deletable ? 
                t('translation-field.tooltip.delete') :
                t('translation-field.tooltip.non-deletable')
              }
            >
              <IconButton
                disabled={!deletable}
              >
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                t('translation-field.info' + camelToKebabCase(props.fieldname))
              }
            >
              <Help />
            </Tooltip>
          </Box>
        </Box>
        <TemplateFieldOutput
          fieldname={props.fieldname}
          values={props.translation.values}
          applicable={props.translation.applicable}
          detailsVisibility={true}
          sx={{ flex: 1 }}
        />
        {/* Make sure it is not interpreted as collapse/expand */}
        <Divider orientation="vertical" flexItem>
          <Tooltip
            title={t('translation-field.tooltip.copy')}
          >
            <IconButton>
              <ChevronRight/>
            </IconButton>
          </Tooltip>
        </Divider>
        <TestFieldOutput
          fieldname={props.fieldname}
          values={props.goal.values}
          score={props.goal.score}
          // delete!
          mandatory={true}
          array={true}
          sx={{ flex: 1 }}
        />
      </CardContent>
      <Divider variant="middle" />
      <Collapse in={true}>
        <CardContent>
          <TemplateFieldComponent
            fieldname={props.fieldname}
            required={props.template.required}
            procedures={props.template.procedures}
          />
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default TranslationFieldComponent;