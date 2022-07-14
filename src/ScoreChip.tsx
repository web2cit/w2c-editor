import React from "react";
import { useTranslation } from 'react-i18next';
import { Chip, Tooltip } from "@mui/material";
  
interface ScoreComponentProps {
  score: number | undefined;
  keyPrefix?: string;
}
  
export function ScoreComponent(props: ScoreComponentProps) {
  const { t } = useTranslation();
  const keyPrefix = props.keyPrefix ? props.keyPrefix + '.' : '';

  if (props.score === undefined) {
    return (
      <Tooltip
        title={t(
          keyPrefix + "score.tooltip.no-score"
        )}
      >
        <Chip
          label={t("score.no-score-label")}
        />
      </Tooltip>
    )
  } else {
    return (
      <Tooltip
        title={t(
          keyPrefix + "score.tooltip.score"
        )}
      >
        <Chip
          label={`${props.score}%`}
          color={
            props.score > 66 ?
            "success" :
            props.score > 33 ?
            "warning" :
            "error"
          }
        />
      </Tooltip>
    )
  }
}
