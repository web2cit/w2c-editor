import { Close, Check } from "@mui/icons-material";
import { Card, CardContent, Tooltip } from "@mui/material";
import React from "react";
import FieldOutput from "./FieldOutput";
import { OutputValue } from "./types";
import { useTranslation } from 'react-i18next';

interface TemplateFieldOutputComponentProps {
  values: OutputValue[];
  fieldname: string;
  applicable: boolean
}

function TemplateFieldOutputComponent(props: TemplateFieldOutputComponentProps) {
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
        <FieldOutput
          values={props.values}
          fieldname={props.fieldname}
          editable={false}
          minLength={1}  // empty template outputs are invalid
        ></FieldOutput>
        
      </CardContent>
      <CardContent>
      {
          props.applicable ?
          <Tooltip title={t("template-field-output.applicable")}>
            <Check />
          </Tooltip> :
          <Tooltip title={t("template-field-output.non-applicable")}>
            <Close />
          </Tooltip>
        }
      </CardContent>
    </Card>
  )
}

export default TemplateFieldOutputComponent;