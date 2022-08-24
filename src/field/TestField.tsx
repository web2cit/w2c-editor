import { Button, Card, CardContent, Skeleton } from "@mui/material";
import { SxProps } from "@mui/system";
import React from "react";
import FieldOutput from "./FieldOutput";
import { 
  TestFieldConfig,
  TestFieldOutput
} from "../types";
import { useTranslation } from 'react-i18next';
import { ScoreComponent } from "../ScoreChip";

interface TestFieldComponentProps {
  fieldname: string;
  config: TestFieldConfig;
  output: TestFieldOutput | undefined;
  // consider pulling these from a configuration file based on the fieldname
  mandatory: boolean; // mandatory fields won't accept an empty output
  array: boolean;
  sx: SxProps;
}

function TestFieldComponent(props: TestFieldComponentProps) {
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
        props.config.goal === undefined ?
        <Button variant="contained">
        {
          t("test-field-output.add-goal")
        }
        </Button> :
        <FieldOutput
          values={props.config.goal}
          fieldname={props.fieldname}
          editable={true}
          minLength={props.mandatory ? 1 : 0}
          maxLength={props.array ? undefined : 1}
        />
      }
      </CardContent>
      <CardContent>
      {
        props.output === undefined ?
        <Skeleton variant="circular" animation="wave" /> :
        <ScoreComponent
          score={props.output.score}
        />
      }
      </CardContent>
    </Card>
  )
}

export default TestFieldComponent;