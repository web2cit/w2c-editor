import {
    Autocomplete,
    Box,
    MenuItem,
    Select,
    TextField,
  } from "@mui/material";
  import React from "react";
  import { useTranslation } from 'react-i18next';
  import { SelectionStep } from '../types';
  import { camelToKebabCase } from '../utils';
  import { transformations } from '../config';
  
  interface TransformationConfigComponentProps {
    fieldname: string;
    type: string;
    args: {
      value: string;
      error?: Error;
    }[]
    itemwise: boolean;
  }
  
  function TransformationConfigComponent(props: TransformationConfigComponentProps) {
    const { t } = useTranslation();
  
    const transformation = transformations.filter(
      (transformation) => transformation.type === props.type
    )[0];
  
    return (
      <Box
        sx={{
          display: "flex",
          gap: "1em"
        }}
      >
      <Select
        value={props.type}
        label={t('transformation-config.type')}
        size="small"
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
          const { value, error } = props.args[index];
          
          const renderInput = (inputParams) => {
            return (
              <TextField
                {...inputParams}
                sx={{ flex: 1 }}
                label={name}
                value={value}
                size="small"
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
      </Box>
    )
  }
  
  export default SelectionConfigComponent;