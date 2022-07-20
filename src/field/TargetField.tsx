import { Box, Card, CardContent, Collapse, Divider, IconButton, Tooltip } from "@mui/material";
import { ChevronRight, Delete, Help } from '@mui/icons-material';
import React from "react";
import { useTranslation } from 'react-i18next';
import TemplateFieldOutputComponent from './TemplateFieldOutput';
import TestFieldComponent from './TestField';
import {
  TemplateFieldConfig,
  TemplateFieldOutput,
  TestFieldConfig,
  TestFieldOutput
} from '../types';
import { camelToKebabCase } from '../utils';
import { TemplateFieldComponent } from './TemplateField';

interface TargetFieldComponentProps {
  name: string;  // should be controlled?
  templateConfig: TemplateFieldConfig;
  templateOutput: TemplateFieldOutput | undefined;
  testConfig: TestFieldConfig;
  testOutput: TestFieldOutput | undefined;
}

// TODO: many of the component settings within a field depend on the field type
// maybe we could create a field context
// or just pass the fieldname, and have components down in the hierarchy get what
// they need from a global configuration file
// Likewise the domain may be a higher-order context
// And the selected target (including its caches)

export function TargetFieldComponent(props: TargetFieldComponentProps) {
  const { t } = useTranslation();
  const deletable = true;
  return (
    <Card
      variant="outlined"
    >
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
            t('translation-field.name.' + camelToKebabCase(props.name))
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
                t('translation-field.info' + camelToKebabCase(props.name))
              }
            >
              <Help />
            </Tooltip>
          </Box>
        </Box>
        <TemplateFieldOutputComponent
          name={props.name}  // context?
          output={props.templateOutput}
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
        <TestFieldComponent
          fieldname={props.name}
          config={props.testConfig}
          output={props.testOutput}
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
            config={props.templateConfig}
            output={props.templateOutput}
          />
        </CardContent>
      </Collapse>
    </Card>
  )
}
