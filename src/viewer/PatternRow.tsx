import React from "react";
import { useTranslation } from 'react-i18next';
import { Box, Card, CardActions, CardContent, Collapse, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { Edit, ExpandLess, ExpandMore } from "@mui/icons-material";
import ListItemActionsComponent from "../ListItemActions";
import { TemplateRow } from './TemplateRow';
  
interface PatternRowProps {
  pattern: string | undefined;
  label?: string;
  fallbackTemplate: boolean;
  templates: {
    path: string | undefined;
    label?: string;
  }[];
  targets: {
    path: string;
    score: number | undefined;
    template: string | undefined;
  }[];
  currentPath?: string;
  // editable: boolean;
  first?: boolean;
  last?: boolean;
}
  
export function PatternRow(props: PatternRowProps) {
  const { t } = useTranslation();
  const collapsed = false;
  const fallback = props.pattern === undefined;
  const templates = [
    ...props.templates
  ];
  if (props.fallbackTemplate) templates.push({ path: undefined })

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
              disabled={fallback}
              label="pattern"
              size="small"
              value={
                fallback ?
                "*/**" :
                props.pattern
              }  // we should get this one from the config
              variant="outlined"
            />
            <TextField
              disabled={fallback}
              label="label"
              size="small"
              value={
                fallback ?
                "fallback" :
                props.label
              }
              variant="outlined"
            />
          </Box>          
          <ListItemActionsComponent
            first={props.first}
            last={props.last}
            editable={!fallback}
          />
        </Box>
        <Collapse in={!collapsed}>
          <Stack spacing={1}>
          {
            templates.map((template, index) => {

              const targets = props.targets.filter(
                (target) => target.template === template.path
              );
              return (
                <TemplateRow
                  path={template.path}
                  label={template.label}
                  targets={targets}
                  first={index === 0}
                  last={index === props.templates.length - 1}
                  currentPath={props.currentPath}
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
