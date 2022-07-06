import { Box, Button, Card, CardContent, IconButton, Tooltip } from "@mui/material";
import { Delete, Help } from '@mui/icons-material';
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
        <Tooltip
          title={t('translation-field.tooltip.copy')}
        >
          <Button
            variant="contained"
            size="small"
            sx={{
              minWidth: 0
            }}
          >{'>'}</Button>
        </Tooltip>
        <TestFieldOutput
          fieldname={props.fieldname}
          values={props.goal.values}
          score={props.goal.score}
          // delete!
          mandatory={true}
          array={true}
        />
      </CardContent>
      <CardContent>
        Field details here
      </CardContent>
    </Card>
  )
}

export default TranslationFieldComponent;