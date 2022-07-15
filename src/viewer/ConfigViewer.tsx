import React from "react";
import { useTranslation } from 'react-i18next';
import { Box, Button,  Stack } from "@mui/material";
import { PatternRow } from "./PatternRow";
  
interface ConfigViewerProps {
  fallbackPattern: boolean;
  patterns: {
    pattern: string | undefined;
    label?: string;
  }[];
  templates: {
    path: string | undefined;
    label?: string;
    pattern: string | undefined;
  }[];
  targets: Target[];
  currentPath?: string;  // highlight the target and template in blue
  selectedPath?: string;  // collapse the viewer
}

interface Target {
  path: string;
  score: number | undefined;
  pattern: string | undefined;
  template: string | undefined;
}
  
export function ConfigViewer(props: ConfigViewerProps) {
  const { t } = useTranslation();
  let patterns = [
    ...props.patterns
  ];
  if (props.fallbackPattern) patterns.push({ pattern: undefined });

  let selectedTarget: Target;
  if (props.selectedPath !== undefined) {
    selectedTarget = props.targets.filter(
      (target) => target.path === props.selectedPath
    )[0];
    if (selectedTarget !== undefined) {
      patterns = patterns.filter(
        (pattern) => pattern.pattern === selectedTarget.pattern
      );
    }
  }
  
  return (
    <Box>
      <Stack
        spacing={1}
      >
      {
        patterns.map((pattern, index) => {
          const templates = props.templates.filter(
            (template) => {
              if (selectedTarget === undefined) {
                return template.pattern === pattern.pattern;
              } else {
                return (
                  template.pattern === pattern.pattern &&
                  template.path === selectedTarget.template
                );
              }
            }
          );
          let targets;
          if (selectedTarget === undefined) {
            targets = props.targets.filter(
              (target) => target.pattern === pattern.pattern
            );
          } else {
            targets = [selectedTarget];
          }
          return (
            <PatternRow
              pattern={pattern.pattern}
              label={pattern.label}
              fallbackTemplate={true}
              templates={templates}
              targets={targets}
              first={index === 0}
              last={index === props.patterns.length - 1}
              currentPath={props.currentPath}
            />
          )
        })
      }
      <Button
        variant="contained"
      >
      {
        t('config-viewer.add-pattern')
      }
      </Button>
      </Stack>      
    </Box>
  )
}
