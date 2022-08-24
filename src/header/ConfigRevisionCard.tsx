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
  Select,
  SelectChangeEvent
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { ConfigMetadata } from "../types";
import {
  selectPatternRevisions,
  selectPatternsRevid,
  loadRevision as loadPatternsRevision
} from "../app/patternsSlice";
import {
  selectTemplateRevisions,
  selectTemplatesRevid,
  loadRevision as loadTemplatesRevision
} from "../app/templatesSlice";
import {
  selectTestRevisions,
  selectTestsRevid,
  loadRevision as loadTestsRevision
} from "../app/testsSlice";
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
  // otherwise, we may have separate ConfigRevisionCard wrappers, one for each
  // config type (PatternsRevisionCard, etc)
  let selectRevisions;
  let selectRevid;
  let loadRevision: (
    typeof loadPatternsRevision |
    typeof loadTemplatesRevision |
    typeof loadTestsRevision
  )
  if (props.type === "patterns") {
    selectRevisions = selectPatternRevisions;
    selectRevid = selectPatternsRevid;
    loadRevision = loadPatternsRevision;
  } else if (props.type === "templates") {
    selectRevisions = selectTemplateRevisions;
    selectRevid = selectTemplatesRevid;
    loadRevision = loadTemplatesRevision;
  } else {
    selectRevisions = selectTestRevisions;
    selectRevid = selectTestsRevid;
    loadRevision = loadTestsRevision;
  }
  
  // if (selector === undefined || loadRevision === undefined) throw new Error();
  const revisions = useAppSelector(selectRevisions);

  const revid = useAppSelector(selectRevid);

  useEffect(() => {
    // todo: if no revision loaded (including draft revision)
    if (revisions !== undefined) {
      // note that newest revisions appear first
      const revid = revisions[0]?.id;
      if (revid) dispatch(loadRevision(revid));
    }
  }, [revisions, dispatch, loadRevision]);

  function handleRevisionChange(event: SelectChangeEvent) {
    const revid = Number(event.target.value);
    // todo: the ui should reflect that the revision is loading
    dispatch(loadRevision(revid));
  }

  return (
    <Card
      sx={{ flex: 1 }}
    >
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
            value={revid?.toString() ?? ''}
            onChange={handleRevisionChange}
          >
          {
            revid === null &&
            <MenuItem disabled key={null} value=""><em>Draft</em></MenuItem>
          }
          { revisions && 
            revisions.map((revision) => (
              <MenuItem key={revision.id} value={revision.id}>
                {`${revision.timestamp} (${revision.id})`}
              </MenuItem>
            ))
          }
          {
            revid === 0 &&
            <MenuItem disabled key={0} value={0}><em>Initial</em></MenuItem>
          }
          </Select>
        </CardContent>
        <CardActions>
          {/* todo: consider adding a button to see configuration file */}
          <IconButton
            // todo: basing whether there are changes to be saved on whether the
            // revid is null, would cause that making changes and then undo them
            // be taken as if there were changes to be saved.
            // An alternative would be to save the last revid loaded and
            // calculate whether the local revision matches or not
            disabled={revid !== null}
          >
            <Save />
          </IconButton>
        </CardActions>
      </Box>
    </Card>

  )
}
