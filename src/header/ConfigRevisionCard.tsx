import React from "react";
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  MenuItem,
  Select
} from "@mui/material";
import { Save } from "@mui/icons-material"
  
interface ConfigRevisionCardProps {
  type: string;
  revisions: {
    id: number;
  }[];
  revid: number | undefined;
  changed: boolean;
}

export function ConfigRevisionCard(props: ConfigRevisionCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader
        title={
          t('config-revision-card.title.' + props.type)
        }
      />
      <Box
        sx={{ display: "flex" }}
      >
        <CardContent
          sx={{ flex: 1 }}
        >
          <Select
            label="revision id"
            value={props.revid}
          >
          {
            props.revisions.map((revision) => (
              <MenuItem value={revision.id}>{revision.id}</MenuItem>
            ))
          }            
          </Select>
        </CardContent>
        <CardActions>
          {/* maybe add a button to see configuration file */}
          <IconButton
            disabled={!props.changed}
          >
            <Save />
          </IconButton>
        </CardActions>
      </Box>
    </Card>

  )
}
