import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Tooltip
} from "@mui/material";
import { FilterNone } from '@mui/icons-material'
import StepConfigParam from './StepConfigParam';
import React from "react";
import { useTranslation } from 'react-i18next';
import { TransformationStep } from '../types';
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
      transformations.map((transformation) => (
        <MenuItem
          value={transformation.type}
        >{t(camelToKebabCase(`selection.${transformation.type}.label`))}
        </MenuItem>
      ))
    }
    </Select>
    {
      transformation.params.map((param, index) => {
        const { name, options } = param;
        const fieldOptions: string[] = [];
        const { value, error } = props.args[index];

        return (
          <StepConfigParam
            label={t(camelToKebabCase(
              `transformation.${props.type}.config.${name}.label`
            ))}
            options={fieldOptions.length ? fieldOptions : options}
            prefix={
              fieldOptions.length ?
              `field.${props.fieldname}` :
              `transformation.${props.type}.config.${name}`
            }
            value={value}
            error={error}
          />
        )
      })
    }
    <Tooltip
      title={
        t(
          props.itemwise ?
          'transformation-config.itemwise.disable' :
          'transformation-config.itemwise.enable'
        )
      }
    >
      <IconButton>
        <FilterNone />
      </IconButton>
    </Tooltip>
    </Box>
  )
}

export default TransformationConfigComponent;