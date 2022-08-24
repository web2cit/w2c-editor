import React from "react";
import { useTranslation } from 'react-i18next';
import { Box, Card, CardActions, CardContent, Collapse, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { Edit, ExpandLess, ExpandMore } from "@mui/icons-material";
import ListItemActionsComponent from "../ListItemActions";
import { TemplateRow } from './TemplateRow';
import { useAppSelector } from "../app/hooks";
import { selectAllTemplates, selectFallbackTemplate } from "../app/templatesSlice";
import { selectAllTargets } from "../app/targetsSlice";
import { selectPatternByExpression } from "../app/patternsSlice";
import { TemplateConfig, FallbackTemplateConfig, PatternConfig } from "../types";
  
interface PatternRowProps {
  pattern: string | null;
  // label?: string;
  // fallbackTemplate: boolean;
  // templates: {
  //   path: string | undefined;
  //   label?: string;
  // }[];
  // targets: {
  //   path: string;
  //   score: number | undefined;
  //   template: string | undefined;
  // }[];
  // currentPath?: string;
  // editable: boolean;
  first?: boolean;
  last?: boolean;
  catchall?: PatternConfig;
}
  
export function PatternRow(props: PatternRowProps) {
  const { t } = useTranslation();

  const pattern = useAppSelector((state) => {
    if (props.pattern === null) {
      return props.catchall
    } else {
      selectPatternByExpression(state, props.pattern);
    }
  });

  // todo: consider having selectTargetsByPattern or selectPathsByPattern
  // selectors
  const targets = useAppSelector(selectAllTargets).filter(
    (target) => target.pattern === props.pattern
  );
  const paths = targets.map((target) => target.path);

  // todo: consider having selectTemplatesByPattern selector?
  const templates: Array<TemplateConfig | FallbackTemplateConfig> = useAppSelector(selectAllTemplates).filter(
    // fixme: handle fallback templates
    (template) => paths.includes(template.path ?? '')
  );

  const fallbackTemplate = useAppSelector(selectFallbackTemplate);

  if (pattern === undefined) {
    return (
      <>
      {
        `Error: Could not find pattern for expression ${props.pattern} in app's state.`
      }
      </>
    )
  }

  const collapsed = false;
  const catchall = props.pattern === null;
  
  if (fallbackTemplate) templates.push(fallbackTemplate);

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "flex-start"
      }}
    >
      <CardActions>
      {
        collapsed ?
        <IconButton>
          <ExpandMore />
        </IconButton> :
        <IconButton>
          <ExpandLess />
        </IconButton>
      }
      </CardActions>
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            <TextField
              disabled={catchall}
              label="pattern"
              size="small"
              value={pattern.pattern}
              variant="outlined"
            />
            <TextField
              disabled={catchall}
              label="label"
              size="small"
              value={
                catchall ?
                "catchall" :
                pattern.label
              }
              variant="outlined"
            />
          </Box>          
          <ListItemActionsComponent
            first={props.first}
            last={props.last}
            editable={!catchall}
          />
        </Box>
        <Collapse in={!collapsed}>
          <Stack spacing={1}>
          {
            templates.map((template, index) => {
              // const targets = props.targets.filter(
              //   (target) => target.template === template.path
              // );
              return (
                <TemplateRow
                  path={template.path ?? null}
                  key={template.path}
                  // label={template.label}
                  // targets={targets.filter(
                  //   (target) => target.
                  // ))}
                  first={index === 0}
                  last={index === templates.length - 1}
                  // currentPath={props.currentPath}
                  fallback={fallbackTemplate}
                />
              );
            })
          }
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  )
}
