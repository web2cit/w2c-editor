import React from "react";
import { useTranslation } from 'react-i18next';
import { Box, Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { ScoreComponent } from "../ScoreChip";
import { selectTargetByPath, selectTargetSelection } from "../app/targetsSlice";
import { useAppSelector } from "../app/hooks";
  
interface TargetRowProps {
  elevated: boolean;
  path: string;
  // score: number | undefined;
  // current: boolean;
}
  
export function TargetRow(props: TargetRowProps) {
  const { t } = useTranslation();

  const target = useAppSelector(
    (state) => selectTargetByPath(state, props.path)
  );
  const targetSelection = useAppSelector(selectTargetSelection);

  if (target === undefined) {
    // fixme: will this ever happen? find an alternative if yes
    return (
      <>
      { `Error: Could not find target for path ${props.path} in app's state.` }
      </>
    )
  }

  const current = props.path === targetSelection;

  // fixme?: nesting a target in a template occurs in the template component
  // however, here we display the results corresponding to the preferred
  // template. May these two sides of the coin diverge? Shall we pass target
  // details from the template row component instead of pulling them from the
  // state directly?
  let result;
  if ( target !== undefined && target.preferredResult !== undefined) {
    result = target.results.find(
      (result) => result.template === target.preferredResult
    )
  };

  const score = result?.output?.score;
  
  return (
    <Card
      elevation={
        props.elevated ? undefined : 0
      }
      sx={{
        display: "flex",
        alignItems: "flex-start",
        background:current ? "lightsteelblue" : undefined
      }}
    >
      {/* <CardActions>
      {
        collapsed ?
        <IconButton>
          <ExpandMore />
        </IconButton> :
        <IconButton>
          <ExpandLess />
        </IconButton>
      }
      </CardActions> */}
      <CardContent
        sx={{ flex: 1 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            <Typography>
            {
              target.path
            }
            </Typography>            
          </Box>
          <ScoreComponent
            score={score}
          />
          {/* <ListItemActionsComponent
            editable={true}
          /> */}
        </Box>
        {/* <Collapse in={!collapsed}>
        {
          props.targets.map((target, index) => (
            <TargetRow
              path={target.path}
              score={target.score}
              borderless={false}      
            />
          ))
        }
        </Collapse> */}
      </CardContent>
      {/* // no sorting
      do we want something to visit that target?
      something to get a proxied link?
      // does delete make sense? it means deleting the tests? */}
    </Card>
  )
}
