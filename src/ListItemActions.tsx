import React from "react";
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Tooltip } from "@mui/material";
import { SxProps } from "@mui/system";
import {
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material';
  
interface ListItemActionsComponentProps {
  keyPrefix?: string;
  first?: boolean;
  last?: boolean;
  editable: boolean;
  sx?: SxProps;
}
  
function ListItemActionsComponent(props: ListItemActionsComponentProps) {
  const { t } = useTranslation();
  const keyPrefix = props.keyPrefix ? props.keyPrefix + "." : "";
  return (
    <Box
      sx={props.sx}
    >
      <Tooltip
        title={t(keyPrefix + 'list-item-actions.raise')}
      >
        <IconButton disabled={props.first}>
          <KeyboardArrowUp/>
        </IconButton>
      </Tooltip>
      <Tooltip
        title={t(keyPrefix + 'list-item-actions.lower')}
      >
        <IconButton disabled={props.last}>
          <KeyboardArrowDown/>
        </IconButton>
      </Tooltip>
      <Tooltip
        title={t(keyPrefix + 'list-item-actions.delete')}
      >
        <IconButton>
          <Delete/>
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default ListItemActionsComponent;