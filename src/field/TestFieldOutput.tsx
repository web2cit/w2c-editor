import { Button, Card, CardContent, Chip, Tooltip } from "@mui/material";
import { SxProps } from "@mui/system";
import React from "react";
import FieldOutput from "./FieldOutput";
import { OutputValue } from "../types";
import { useTranslation } from 'react-i18next';
import { ScoreComponent } from "../ScoreChip";

interface TestFieldOutputComponentProps {
  values: OutputValue[] | undefined;
  fieldname: string;
  score: number | undefined;
  // consider pulling these from a configuration file based on the fieldname
  mandatory: boolean; // mandatory fields won't accept an empty output
  array: boolean;
  sx: SxProps;
}

function TestFieldOutputComponent(props: TestFieldOutputComponentProps) {
  const { t } = useTranslation();
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "flex-end",
        ...props.sx
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
        <ScoreComponent
          score={props.score}
        />
      </CardContent>
    </Card>
  )
}

export default TestFieldOutputComponent;