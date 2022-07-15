import React from "react";
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Divider, MenuItem, Select, Stack, Tooltip, Typography } from "@mui/material";
import { Check, Close } from "@mui/icons-material"
import { TranslationFieldComponent } from '../field/TranslationField';
import {
  FieldResult
} from '../types';
import { ScoreComponent } from "../ScoreChip";
  
interface TargetResultComponentProps {
  path: string;
  templates: {
    path: string;
    label?: string;
  }[];
  // templatePath: string;  // make it a state
  fields: FieldResult[]
}
  
export function TargetResultComponent(props: TargetResultComponentProps) {
  const { t } = useTranslation();
  const applicable = props.fields.every((field) => field.translation.applicable);
  const scores = props.fields.reduce((scores: number[], field) => {
    const score = field.goal.score
    if (score !== undefined) {
      scores.push(score);
    }
    return scores;
  }, []);
  const score = (
    scores.length ?
    scores.reduce((sum, score) => sum + score, 0) / scores.length :
    undefined
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1
      }}
    >
      <Box>
        <Typography>
        {
          t('target-result.title', {path: props.path})
        }
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1
          }}
        >
          <Select
            label={t('target-result.template-selector.label')}
            size="small"
            value={props.templatePath}
            sx={{ flex: 1 }}
          >
          {
            props.templates.map((template) => {
              let content = template.path;
              if (template.label) content += ` (${template.label})`;
              return (
                <MenuItem
                  value={template.path}
                >
                { content }
                </MenuItem>
              )
            })
          }
          </Select>
          <Box
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <Tooltip
              title={t(
                applicable ?
                "target-result.applicable" :
                "target-result.non-applicable"
              )}
            >
            {
              applicable ?
              <Check /> :
              <Close />
            }
            </Tooltip>
            <ScoreComponent
              score={score}
              keyPrefix="target-result"
            />
          </Box>
        </Box>
        <Alert severity="error">
          Some alert message
        </Alert>
      </Box>
      <Divider />      
      <Stack
        spacing={1}
      >
      {
        props.fields.map((field) => (
          <TranslationFieldComponent
            fieldname={field.fieldname}
            translation={field.translation}
            goal={field.goal}
            template={field.template}
          />
        ))
      }
        <Button>
        {
          t('target-result.add-field')
        }
        </Button>
      </Stack>
    </Box>
  )
}