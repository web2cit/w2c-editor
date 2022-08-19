import React from "react";
import { useTranslation } from 'react-i18next';
import { Box, Button,  Stack } from "@mui/material";
import { PatternRow } from "./PatternRow";
import { PatternConfig, TemplateConfig } from "../types";
import { useAppSelector } from "../app/hooks";
import { selectAllPatterns, selectCatchallPattern } from "../app/patternsSlice";
import { selectAllTemplates } from "../app/templatesSlice";
  
interface ConfigViewerProps {
  // fallbackPattern: boolean;
  // fallbackTemplate: boolean;
  // patterns: PatternConfig[];
  // templates: Template[];
  // targets: Target[];
  // move these two to context?
  // currentPath?: string;  // highlight the target and template in blue
  // selectedPath?: string;  // collapse the viewer
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

  const patterns = useAppSelector(selectAllPatterns);
  const catchallPattern = useAppSelector(selectCatchallPattern);

  // let patterns = [
  //   ...props.patterns
  // ];

  const expressions: Array<string | null> = patterns.map(
    (pattern) => pattern.pattern
  );

  if (catchallPattern) expressions.push(null);

  let selectedTarget: Target;
  // if (props.selectedPath !== undefined) {
  //   selectedTarget = props.targets.filter(
  //     (target) => target.path === props.selectedPath
  //   )[0];
  //   if (selectedTarget !== undefined) {
  //     patterns = patterns.filter(
  //       (pattern) => pattern.pattern === selectedTarget.pattern
  //     );
  //   }
  // }
  
  return (
    <Box>
      <Stack
        spacing={1}
      >
      {
        expressions.map((expression, index) => {
          // let targets;
          // if (selectedTarget === undefined) {
          //   targets = props.targets.filter(
          //     (target) => target.pattern === pattern.pattern
          //   );
          // } else {
          //   targets = [selectedTarget];
          // }
          return (
            <PatternRow
              pattern={expression}
              key={expression}
              // label={pattern.label}
              // fallbackTemplate={props.fallbackTemplate}
              // templates={templates.filter(
              //   (template) => {
              //     if (selectedTarget === undefined) {
              //       return template.pattern === pattern.pattern;
              //     } else {
              //       return (
              //         template.pattern === pattern.pattern &&
              //         template.path === selectedTarget.template
              //       );
              //     }
              //   }
              // )}
              // targets={targets}
              first={index === 0}
              last={index === patterns.length - 1}
              // currentPath={props.currentPath}
              catchall={catchallPattern}
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
