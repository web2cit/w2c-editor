import React from "react";
import { useTranslation } from 'react-i18next';
import { Box, Button,  Stack } from "@mui/material";
import { PatternRow } from "./PatternRow";
import { PatternConfig, TemplateConfig } from "../types";
  
interface ConfigViewerProps {
  fallbackPattern: boolean;
  fallbackTemplate: boolean;
  patterns: PatternConfig[];
  templates: Template[];
  targets: Target[];
  // move these two to context?
  currentPath?: string;  // highlight the target and template in blue
  selectedPath?: string;  // collapse the viewer
}

// this pattern-sorted template interface is also defined in Sidebar
interface Template extends TemplateConfig {
  pattern: string | undefined;
}

// a similar target interface, with output and without score is defined in
// Sidebar
interface Target {
  path: string;
  pattern: string | undefined;
  template: string | undefined;
  score: number | undefined;
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
              fallbackTemplate={props.fallbackTemplate}
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
