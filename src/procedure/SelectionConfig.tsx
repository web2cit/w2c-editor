import {
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import StepConfigParam from './StepConfigParam';
import React from "react";
import { useTranslation } from 'react-i18next';
import { SelectionConfig } from '../types';
import { camelToKebabCase } from '../utils';
import { selections } from '../config';

interface SelectionConfigComponentProps extends SelectionConfig {
  fieldname: string;
}

function SelectionConfigComponent(props: SelectionConfigComponentProps) {
  const { t } = useTranslation();

  const selection = selections.filter(
    (selection) => selection.type === props.type
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
      label={t('selection-config.type')}
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

        return (
          <StepConfigParam
            label={t(camelToKebabCase(
              `selection.${props.type}.config.${name}.label`
            ))}
            options={fieldOptions.length ? fieldOptions : options}
            prefix={
              fieldOptions.length ?
              `field.${props.fieldname}` :
              `selection.${props.type}.config.${name}`
            }
            value={value}
            error={error}
          />
        )
      })
    }
    </Box>
  )
}

export default SelectionConfigComponent;