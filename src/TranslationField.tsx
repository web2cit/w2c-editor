import { Box, Card, CardContent, Divider, IconButton, Tooltip } from "@mui/material";
import { ChevronRight, Delete, Help } from '@mui/icons-material';
import React from "react";
import { useTranslation } from 'react-i18next';
import TemplateFieldOutput from './TemplateFieldOutput';
import TestFieldOutput from './TestFieldOutput';
import { OutputValue } from './types';
import { camelToKebabCase } from './utils';

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
          display: "flex"
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
        />
      </CardContent>
      <Collapse>
        <CardContent>
          Field details here
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default TranslationFieldComponent;