import React from "react";
import {
  TextField,
  IconButton,
  Tooltip,
  MenuItem,
  Card,
  CardActions,
  CardContent
} from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown, Delete, Check, Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface OutputValueProps {
  value: string;
  valid: boolean;
  editable: boolean;
  fieldname: string; // shall this be part of the context?
  first?: boolean;
  last?: boolean;
  options?: string[];
}

function OutputValue(props: OutputValueProps) {
  const { t } = useTranslation();
  return(
    <Card
      sx={{
        display: "flex",
        backgroundColor: props.valid ? "lime" : "red"
      }}
    >
      <CardContent
        sx={{
          flex: 1
        }}
      >
        <TextField
          hiddenLabel
          size="small"
          variant="standard"
          disabled={!props.editable}
          value={props.value}
          select={props.options !== undefined}
        >
        {
          props.options && props.options.map((option) => (
            <MenuItem value={option}>{option}</MenuItem>
          ))
        }
        </TextField>
      </CardContent>
      <CardActions>
        {
          props.editable && !props.first &&
          <Tooltip title={t("output-value.raise")}>
            <IconButton>
              <KeyboardArrowUp />              
            </IconButton>
          </Tooltip>
        }
        {
          props.editable && !props.last &&
          <Tooltip title={t("output-value.lower")}>
            <IconButton>
              <KeyboardArrowDown/>
            </IconButton>
          </Tooltip>
        }
        {
          props.editable &&
          <Tooltip title={t("output-value.delete")}>
            <IconButton>
              <Delete />              
            </IconButton>
          </Tooltip>
        }
        {
          props.valid ?
          (
            <Tooltip
              title={t("output-value.valid")}
            >
              <Check />
            </Tooltip>
          ) :
          (
            <Tooltip
              title={t("output-value.invalid")}
            >
              <Close />
            </Tooltip>
          )
        }
      </CardActions>
    </Card>
  )
}

export default OutputValue;