import React from "react";
import {
  TextField,
  Tooltip,
  MenuItem,
  Card,
  CardActions,
  CardContent
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ListItemActions from './ListItemActions';

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
      </CardContent>
      <CardActions>
      { props.editable &&
        <ListItemActions
          keyPrefix='output-value'
          first={props.first}
          last={props.last}
          editable={props.editable}
        />
      }
      </CardActions>
    </Card>
  )
}

export default OutputValue;