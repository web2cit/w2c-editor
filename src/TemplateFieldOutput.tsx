import { Close, Check, Visibility, VisibilityOff } from "@mui/icons-material";
import { Card, CardContent, IconButton, Tooltip } from "@mui/material";
import { SxProps } from "@mui/system";
import React from "react";
import FieldOutput from "./FieldOutput";
import { OutputValue } from "./types";
import { useTranslation } from 'react-i18next';

interface TemplateFieldOutputComponentProps {
  values: OutputValue[];
  fieldname: string;
  applicable: boolean;
  sx?: SxProps;
  detailsVisibility: boolean;
}

function TemplateFieldOutputComponent(props: TemplateFieldOutputComponentProps) {
  const { t } = useTranslation();
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "stretch",        
        ...props.sx
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
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
      {
        props.detailsVisibility ?
        <Tooltip
          title={t("template-field-output.tooltip.toggle-details-off")}
        >
          <IconButton>
            <Visibility />
          </IconButton>
        </Tooltip> :
        <Tooltip
          title={t("template-field-output.tooltip.toggle-details-on")}
        >
          <IconButton>
            <VisibilityOff />
          </IconButton>
        </Tooltip>
      }
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