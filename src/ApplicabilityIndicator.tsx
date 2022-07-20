import React from "react";
import { useTranslation } from 'react-i18next';
import { Tooltip } from "@mui/material";
import { Check, Close, QuestionMark } from "@mui/icons-material"
  
interface ApplicabilityIndicatorProps {
  applicable: boolean | undefined;
  keyPrefix?: string;
}
  
export function ApplicabilityIndicator(props: ApplicabilityIndicatorProps) {
  const { t } = useTranslation();
  const keyPrefix = props.keyPrefix ? props.keyPrefix + '.' : '';

  if (props.applicable === undefined) {
    return (
      <Tooltip
        title={
          t("applicability-indicator.tooltip.undefined")
        }
      >
        <QuestionMark />
      </Tooltip>
    )
  } else if (props.applicable) {
    return (
      <Tooltip
        title={t(
          keyPrefix + "score.tooltip.no-score"
        )}
      >
        <Check />
      </Tooltip>
    )
  } else {
    return (
      <Tooltip
        title={t(
          keyPrefix + "score.tooltip.score"
        )}
      >
        <Close />
      </Tooltip>
    )
  }
}
