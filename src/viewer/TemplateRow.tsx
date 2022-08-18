import React from "react";
import { useTranslation } from 'react-i18next';
import { Box, Card, CardActions, CardContent, Collapse, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { Edit, ExpandLess, ExpandMore } from "@mui/icons-material";
import ListItemActionsComponent from "../ListItemActions";
import { TargetRow } from "./TargetRow";
import { useAppSelector } from "../app/hooks";
import { selectTemplateByPath } from "../app/templatesSlice";
import { selectAllTargets, selectTargetSelection } from "../app/targetsSlice";
import { TemplateConfig } from "../types";
  
interface TemplateRowProps {
  // fixme: fallback template should be null
  path: string | null;
  // label?: string;
  // targets: {
  //   path: string;
  //   score: number | undefined;
  // }[];
  first?: boolean;
  last?: boolean;
  // currentPath?: string;
  fallback?: TemplateConfig;
}
  
export function TemplateRow(props: TemplateRowProps) {
  const { t } = useTranslation();

  const template = useAppSelector((state) => {
    if (props.path === null) {
      return props.fallback;
    } else {
      return selectTemplateByPath(state, props.path)
    }
  });
  const targetSelection = useAppSelector(selectTargetSelection);
  
  // todo: consider having selectTargetsByTemplate or
  // selectTargetPathsByPreferredTemplate selector
  // note: targets are returned in the order they are in the state
  const paths = useAppSelector(selectAllTargets).filter((target) => {
    // targets whose preferred result is undefined (yet) should be sorted into
    // the fallback template temporarily
    // todo: what should we do if we drop support for fallback template (T302019)    
    const targetPreferredTemplatePath = target.preferredResult ?? null;
    return targetPreferredTemplatePath === props.path;
  });

  if (template === undefined) {
    // fixme: can this ever happen? If yes, consider alternative
    return (
      <>
      {
        `Error: Could not find template for path ${props.path} in app's state.`
      }
      </>
    );
  }

  const collapsed = false;
  const fallback = template.path === null;
  const current = props.path === targetSelection;

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "flex-start",
        background: current ? "lightsteelblue" : undefined
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
              disabled
              label="template path"
              size="small"
              value={
                fallback ?
                "-" :
                props.path
              }
              variant="outlined"
            />
            <TextField
              disabled={fallback}
              label="template label"
              size="small"
              value={
                fallback ?
                "fallback" :
                template.label
              }
              variant="outlined"
            />
            </Box>          
          <ListItemActionsComponent
            first={props.first}
            last={props.last}
            editable={!fallback}
            // template should be movable but not removable
          />
        </Box>
        <Collapse in={!collapsed}>
          <Stack spacing={1}>
          {
            paths.map((target, index) => (
              <TargetRow
                elevated={target.path !== props.path}
                path={target.path}
                // score={target.score}
                // current={target.path === props.currentPath}
              />
            ))
          }
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  )
}
