import React from "react";
import { useTranslation } from 'react-i18next';
import { Box, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import {
  TargetResult,
  TemplatePath
} from '../types';
import { ScoreComponent } from "../ScoreChip";
import {
  isResultApplicable,
  getResultScore
} from "../utils";
import { ApplicabilityIndicator } from "../ApplicabilityIndicator";
  
interface TargetResultSelectorProps {
  results: TargetResult[];
  selection: TemplatePath | undefined;
  onSelectionChange: (selection: TemplatePath) => void
}

export function TargetResultSelector(props: TargetResultSelectorProps) {
  const { t } = useTranslation();

  let selection: string;
  if (props.selection === undefined) {
    selection = '';
  } else if (props.selection === null) {
    selection = 'fallback';
  } else {
    selection = props.selection;
  }

  function handleSelectionChange(e: SelectChangeEvent) {
    const selection = e.target.value;
    props.onSelectionChange(selection === 'fallback' ? null : selection);
  }

  const result = props.results.filter(
    (result) => result.template === props.selection
  )[0];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1
        }}
      >
        <Select
          label={
            "Using template for"
            // t('target-result.template-selector.label')
          }
          size="small"
          value={selection}            
          renderValue={(value) => value}
          onChange={handleSelectionChange}
          sx={{ flex: 1 }}
        >
        {
          props.results.map((result) => (
            <MenuItem
              value={result.template ?? 'fallback'}
              key={result.template}
              sx={{
                opacity: result.output === null ? .38 : 1,
                display: "flex"
              }}
            >
              <Typography
                sx={{
                  flex: 1,
                  textDecoration: (
                    result.output && !result.output.applicable ?
                    "line-through" :
                    undefined
                  )
                }}
              >
              {
                result.template ?? <em>fallback</em>
              }
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <ApplicabilityIndicator
                  applicable={result.output?.applicable}
                />
                <ScoreComponent
                  score={result.output?.score}
                />
              </Box>
            </MenuItem>
          ))
        }
        </Select>
        <Box
          sx={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <ApplicabilityIndicator
            applicable={result && result.output?.applicable}
          />
          <ScoreComponent
            score={result && result.output?.score}
          />
        </Box>
      </Box>      
    </Box>
  )
}