import React from "react";
import { useTranslation } from 'react-i18next';
import { Chip, Tooltip } from "@mui/material";
  
interface ScoreComponentProps {
  score: number | null | undefined;
  keyPrefix?: string;
}
  
export function ScoreComponent(props: ScoreComponentProps) {
  const { t } = useTranslation();
  const keyPrefix = props.keyPrefix ? props.keyPrefix + '.' : '';

  if (props.score === undefined) {
    return (
      <Tooltip
        title={""}
      >
        <Chip
          label="?"
        />
      </Tooltip>
    )
  } else if (props.score === null) {
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
          label={`${
            Math.floor(props.score*100)
          }%`}
          color={
            props.score > 2/3 ?
            "success" :
            props.score > 1/3 ?
            "warning" :
            "error"
          }
        />
      </Tooltip>
    )
  }
}
