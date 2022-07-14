import React from "react";
import { useTranslation } from 'react-i18next';
import { Box, Card, CardActions, CardContent, Collapse, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { Edit, ExpandLess, ExpandMore } from "@mui/icons-material";
import ListItemActionsComponent from "../ListItemActions";
import { TargetRow } from "./TargetRow";
  
interface TemplateRowProps {
  path: string | undefined;
  label?: string;
  targets: {
    path: string;
    score: number | undefined;
  }[];
  first?: boolean;
  last?: boolean;
}
  
export function TemplateRow(props: TemplateRowProps) {
  const { t } = useTranslation();
  const collapsed = false;
  const fallback = props.path === undefined;

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
                props.label
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
            props.targets.map((target, index) => (
              <TargetRow
                elevated={target.path !== props.path}
                path={target.path}
                score={target.score}   
              />
            ))
          }
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  )
}
