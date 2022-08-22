import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
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
import { Save } from "@mui/icons-material";
import { ConfigMetadata } from "../types";
import { selectPatternRevisions, loadRevision as loadPatternsRevision } from "../app/patternsSlice";
import { selectTemplateRevisions, loadRevision as loadTemplatesRevision } from "../app/templatesSlice";
import { selectTestRevisions, loadRevision as loadTestsRevision } from "../app/testsSlice";
import { LoadRevisionThunkActionCreator } from "../app/configSlice";
  
// interface ConfigRevisionCardProps extends ConfigMetadata {
//   type: string;
// }

interface ConfigRevisionCardProps {
  type: string;
}

// TODO: add something to edit config file externally
// this may be useful in the initial preview of the editor
// which may simply visualize results returned by translation server
// and have editing disabled

export function ConfigRevisionCard(props: ConfigRevisionCardProps) {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  // fixme: selector and action generators depend on the config type
  // should we have selector and action generators accept an additional pattern
  // indicating the config type?
  // alternatively, have a function that returns the appropriate selector, etc
  // depending on the config type
  let selector;
  let loadRevision: (
    typeof loadPatternsRevision |
    typeof loadTemplatesRevision |
    typeof loadTestsRevision
  )
  if (props.type === "patterns") {
    selector = selectPatternRevisions;
    loadRevision = loadPatternsRevision;
  } else if (props.type === "templates") {
    selector = selectTemplateRevisions;
    loadRevision = loadTemplatesRevision;
  } else {
    selector = selectTestRevisions;
    loadRevision = loadTestsRevision;
  }
  
  // if (selector === undefined || loadRevision === undefined) throw new Error();
  const revisions = useAppSelector(selector);

  // todo: select currently loaded revid from state

  useEffect(() => {
    // todo: if no revision loaded (including draft revision)
    if (revisions !== undefined) {
      // note that newest revisions appear first
      const revid = revisions[0]?.id;
      if (revid) dispatch(loadRevision(revid));
    }
  }, [revisions, dispatch, loadRevision]);

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
            // value={revisions}
          >
          { revisions && 
            revisions.map((revision) => (
              <MenuItem key={revision.id} value={revision.id}>{revision.id}</MenuItem>
            ))
          }            
          </Select>
        </CardContent>
        <CardActions>
          {/* maybe add a button to see configuration file */}
          <IconButton
            // disabled={!props.changed}
          >
            <Save />
          </IconButton>
        </CardActions>
      </Box>
    </Card>

  )
}
