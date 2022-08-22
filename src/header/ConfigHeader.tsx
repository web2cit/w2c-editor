import React from "react";
import { useSelector } from "react-redux";
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
import { ConfigMetadata } from "../types";
import { useAppSelector } from "../app/hooks";
import { selectDomainName } from "../app/domainSlice";
  
interface ConfigHeaderProps {
  // domain: string;
  // // storage: string;
  // patternConfig: ConfigMetadata;
  // templateConfig: ConfigMetadata;
  // testConfig: ConfigMetadata;
}

export function ConfigHeader(props: ConfigHeaderProps) {
  const { t } = useTranslation();

  const domain = useAppSelector(selectDomainName);

  //   // on refresh
  //   onRefresh: // action triggered when the refresh button at the top is pressed
  //   // consider having separate buttons per config file
  //   // do we need extra refresh buttons? for example next to each target?

  // what the refresh button in the header does depends on the mode
  // * the mode with the w2c library reloads the configuration files from Meta
  // * the mode simply showing the server results reloads the server response

  //   handleRefresh() {
  //     // fetch configuration revisions again
  //     // what should we do if there is a new revision?
  //     // we should consider whether the user has made changes
  //     // and maybe ask them whether we should overwrite them
  //     // update the patterns/templates/tests props accordingly
  //     // maybe also update pathToPattern and outputsByTarget
  //   }

  return (
    <Card>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <CardHeader
          title={domain}
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
          // revisions={props.patternConfig.revisions}
          // revid={props.patternConfig.revid}
          // changed={props.patternConfig.changed}
        />
        <ConfigRevisionCard
          type="templates"
          // revisions={props.templateConfig.revisions}
          // revid={props.templateConfig.revid}
          // changed={props.templateConfig.changed}
        />
        <ConfigRevisionCard
          type="tests"
          // revisions={props.templateConfig.revisions}
          // revid={props.templateConfig.revid}
          // changed={props.templateConfig.changed}
        />
      </CardContent>
    </Card>
  )
}
