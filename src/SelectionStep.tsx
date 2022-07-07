import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Collapse,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip
} from "@mui/material";
import {
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material';
import React from "react";
import { useTranslation } from 'react-i18next';
import { SelectionStep } from './types';
import { camelToKebabCase } from './utils';
import { selections } from './config';

// reuse from types?
interface SelectionStepComponentProps {
  fieldname: string;
  type: string;
  config: {
    value: string;
    error?: Error;
  }[]
  output: string[];
  error?: Error;
  first?: boolean;
  last?: boolean;
}

function SelectionStepComponent(props: SelectionStepComponentProps) {
  const { t } = useTranslation();
  
  const selection = selections.filter(
    (selection) => selection.type === props.type
  )[0];

  return (
    <Card>
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1em"
        }}
      >
        <Select
          value={props.type}
          label={t('selection-step.type')}
        >
        {
          selections.map((selection) => (
            <MenuItem
              value={selection.type}
            >{t(camelToKebabCase(`selection.${selection.type}.label`))}
            </MenuItem>
          ))
        }
        </Select>
        {
          selection.config.map((param, index) => {
            const { name, options } = param;
            const fieldOptions: string[] = [];
            const { value, error } = props.config[index];
            
            const renderInput = (inputParams) => {
              return (
                <TextField
                  {...inputParams}
                  sx={{ flex: 1 }}
                  label={name}
                  value={value}
                />
              )
            }

            if (fieldOptions.length || options.length) {
              return(
                <Autocomplete
                  sx={{ flex: 1 }}
                  options={
                    fieldOptions.length ?
                    fieldOptions :
                    options
                  }
                  getOptionLabel={(option) => (
                    t(camelToKebabCase(
                      fieldOptions.length ?
                      `field.${props.fieldname}.option.${option}` :
                      `selection.${props.type}.config.${name}.option.${option}`
                    )) + ` (${option})`
                  )}
                  renderInput={renderInput}
                />
              )
            } else {
              return renderInput({});
            }
          })
        }
        <Divider variant="middle" orientation="vertical" flexItem />
        <Box>
          <IconButton disabled={props.first}>
            <KeyboardArrowUp/>
          </IconButton>    
          <IconButton disabled={props.last}>
            <KeyboardArrowDown/>
          </IconButton>
          <IconButton>
            <Delete/>
          </IconButton>
        </Box>
      </CardContent>
      <Divider variant="middle">
        <IconButton>
          <KeyboardArrowDown/>
        </IconButton>
      </Divider>
      <Collapse in={true}>
        <CardContent>
          {/* Create separate OutputList component and reuse from FieldOutput */}
          {/* Shall we use chips to save space? */}
          <Stack>
          {/* {
            props.output.length ?
            props.output.map((value) => (
              <Card>
                <CardContent>
                  {value}
                </CardContent>
              </Card>
            )) :
            'empty output'
          } */}
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default SelectionStepComponent;