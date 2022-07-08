import {
  Autocomplete,
  TextField,
} from "@mui/material";
import React, { ReactNode } from "react";
import { useTranslation } from 'react-i18next';
import { camelToKebabCase } from '../utils';

interface StepConfigParamComponentProps {
  label: string;
  // type: string;
  options: string[];
  prefix: string;
  value: string;
  error?: Error;
  adornment?: ReactNode;
}

function StepConfigParamComponent(props: StepConfigParamComponentProps) {
  const { t } = useTranslation();
  const renderInput = (inputParams) => {
    return (
      <TextField
        {...inputParams}
        sx={{ flex: 1 }}
        label={props.label}
        value={props.value}
        size="small"
      />
    )
  }

  if (props.options.length) {
    return (
      <Autocomplete
        sx={{ flex: 1 }}
        options={props.options}
        getOptionLabel={(option) => (
          t(`${props.prefix}.option.${camelToKebabCase(option)}`)
        )}
        renderInput={renderInput}
        value={props.value}
      />
    )
  } else {
    return renderInput({});
  }
}

export default StepConfigParamComponent;