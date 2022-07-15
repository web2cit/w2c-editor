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
  Select,
  TextField,
  Typography
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { ConfigRevisionCard } from "./ConfigRevisionCard";
  
interface ConfigHeaderProps {
  domain: string;
  // storage: string;
  patternConfig: Config;
  templateConfig: Config;
  testConfig: Config;
}

// replace with the corresponding type
interface Config {
  revisions: {
    id: number;
    timestamp: Date;
  }[];
  revid: number | undefined
  changed: boolean;
}

export function ConfigHeader(props: ConfigHeaderProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <CardHeader
          title={props.domain}
        />
        <CardActions>
        {/* 
          YAGNI: do we need different storage settings?
          maybe yes if using the editor as a viewer only
          <Select
            // do we have to disclose this?
            // if yes, consider using shortcuts (e.g., "Meta storage")
            label={"Storage"}
            value={props.storage}
            size="small"
            sx={{ flex: 1 }}
          >
            <MenuItem value={props.storage}>{props.storage}</MenuItem>
          </Select>
        */}
          <IconButton>
            <Refresh />
          </IconButton>
        </CardActions>
      </Box>
      <CardContent
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "space-between"
        }}
      >
        <ConfigRevisionCard
          type="patterns"
          revisions={props.patternConfig.revisions}
          revid={props.patternConfig.revid}
          changed={props.patternConfig.changed}
        />
        <ConfigRevisionCard
          type="templates"
          revisions={props.templateConfig.revisions}
          revid={props.templateConfig.revid}
          changed={props.templateConfig.changed}
        />
        <ConfigRevisionCard
          type="tests"
          revisions={props.templateConfig.revisions}
          revid={props.templateConfig.revid}
          changed={props.templateConfig.changed}
        />
      </CardContent>
    </Card>
  )
}
