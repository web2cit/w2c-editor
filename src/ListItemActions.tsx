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
      sx={{
        display: "flex",
        ...props.sx
      }}
    >
      <Tooltip
        title={t(keyPrefix + 'list-item-actions.raise')}
      >
        <div>
          <IconButton disabled={props.first || !props.editable}>
            <KeyboardArrowUp/>
          </IconButton>
        </div>
      </Tooltip>
      <Tooltip
        title={t(keyPrefix + 'list-item-actions.lower')}
      >
        <div>
          <IconButton disabled={props.last || !props.editable}>
            <KeyboardArrowDown/>
          </IconButton>
        </div>
      </Tooltip>
      <Tooltip
        title={t(keyPrefix + 'list-item-actions.delete')}
      >
        <div>
          <IconButton disabled={!props.editable}>
            <Delete/>
          </IconButton>
        </div>
      </Tooltip>
    </Box>
  )
}

export default ListItemActionsComponent;