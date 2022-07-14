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
  targets: {
    path: string;
    score: number | undefined;
    pattern: string | undefined;
    template: string | undefined;
  }[];
}
  
export function ConfigViewer(props: ConfigViewerProps) {
  const { t } = useTranslation();
  const patterns = [
    ...props.patterns
  ];
  if (props.fallbackPattern) patterns.push({ pattern: undefined });

  return (
    <Box>
      <Stack
        spacing={1}
      >
      {
        patterns.map((pattern, index) => {
          const templates = props.templates.filter(
            (template) => template.pattern === pattern.pattern
          );
          const targets = props.targets.filter(
            (target) => target.pattern === pattern.pattern
          );
          return (
            <PatternRow
              pattern={pattern.pattern}
              label={pattern.label}
              fallbackTemplate={true}
              templates={templates}
              targets={targets}
              first={index === 0}
              last={index === props.patterns.length - 1}
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
