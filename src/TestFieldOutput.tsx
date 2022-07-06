import { Button, Card, CardContent, Chip, Tooltip } from "@mui/material";
import React from "react";
import FieldOutput from "./FieldOutput";
import { OutputValue } from "./types";
import { useTranslation } from 'react-i18next';

interface TestFieldOutputComponentProps {
  values: OutputValue[] | undefined;
  fieldname: string;
  score: number | undefined;
  // consider pulling these from a configuration file based on the fieldname
  mandatory: boolean; // mandatory fields won't accept an empty output
  array: boolean;
}

function TestFieldOutputComponent(props: TestFieldOutputComponentProps) {
  const { t } = useTranslation();
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "flex-end"
      }}
    >
      <CardContent
        sx={{
          flex: 1
        }}
      >
      {
        props.values === undefined ?
        <Button variant="contained">
        {
          t("test-field-output.add-goal")
        }
        </Button> :
        <FieldOutput
          values={props.values}
          fieldname={props.fieldname}
          editable={true}
          minLength={props.mandatory ? 1 : 0}
          maxLength={props.array ? undefined : 1}
        />
      }
      </CardContent>
      <CardContent>
      {
        // consider creating a separate score component
        // would it be ok to use the same component for field and target score?
        props.score === undefined ?
        <Tooltip title={t("test-field-output.tooltip.no-score")}>
          <Chip label={t("test-field-output.no-score-label")} />
        </Tooltip> :
        <Tooltip title={t("test-field-output.tooltip.score")}>
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
      }
      </CardContent>
    </Card>
  )
}

export default TestFieldOutputComponent;