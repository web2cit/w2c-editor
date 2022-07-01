import { Box, Button, Card, CardActions, CardContent, IconButton, Stack, Tooltip, Typography } from "@mui/material"
import React from "react";
import OutputValueMaterial from "./OutputValue";
import { OutputValue } from "./types";
import { Delete, Check, Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface FieldOutputComponentProps {
  values: OutputValue[];
  fieldname: string;
  editable: boolean;
  // maybe add a readonly property, because non-readonly fields
  // may not be editable in some cases (e.g., not current target)
  minLength: number;
  maxLength?: number;
}

function FieldOutputComponent(props: FieldOutputComponentProps) {
  const { t } = useTranslation();

  // have this re-computed on every render
  // shouldn't we get this from the core rather than recalculate it here?
  const valid = (
    props.values.length >= props.minLength &&
    props.values.every((value) => value.valid)
  );

  return (
    <Card
      sx={{
        display: "flex",
        backgroundColor: valid ? "limegreen" : "red"  // do not inherit below!
      }}
    >
      <CardContent
        sx={{
          flex: 1
        }}
      >
      {
        <Stack spacing={1}>
        {
          props.values.length ?
          props.values.map((value) => (
            <OutputValueMaterial
              value={value.value}
              valid={value.valid}
              fieldname={props.fieldname}
              editable={props.editable}
            />
          )) :
          <Typography>
          {
            t("field-output.empty")
          }          
          </Typography>
        }
        {
          props.editable && (
            props.maxLength === undefined ||
            props.values.length < props.maxLength
          ) &&
          <Button
            variant="contained"
            size="small"
          >
          {
            t("field-output.new-value")
          }
          </Button>
        }
        </Stack>
      }
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        {
          props.editable &&
          // we may want to customize the delete tooltip to say
          // "delete translation goal" instead of "delete field output"
          <Tooltip title={t("field-output.delete")}>
            <IconButton>
              <Delete />
            </IconButton>
          </Tooltip>
        }
        <Box
          sx={{
            textAlign: "center",
            marginTop: "auto"
          }}
        >
          <Tooltip
            title={
              valid ?
              t("field-output.valid") :
              t("field-output.invalid")
            }
          >
          {
            valid ?
            <Check /> :
            <Close />
          }
          </Tooltip>
        </Box>
      </CardActions>      
    </Card>
  )
}

export default FieldOutputComponent;