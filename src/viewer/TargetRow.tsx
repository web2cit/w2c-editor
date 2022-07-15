import React from "react";
import { useTranslation } from 'react-i18next';
import { Box, Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { ScoreComponent } from "../ScoreChip";
  
interface TargetRowProps {
  elevated: boolean;
  path: string;
  score: number | undefined;
  current: boolean;
}
  
export function TargetRow(props: TargetRowProps) {
  const { t } = useTranslation();
  
  return (
    <Card
      elevation={
        props.elevated ? undefined : 0
      }
      sx={{
        display: "flex",
        alignItems: "flex-start",
        background: props.current ? "lightsteelblue" : undefined
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
              props.path
            }
            </Typography>            
          </Box>
          <ScoreComponent
            score={props.score}
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
