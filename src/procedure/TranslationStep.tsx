import {
  Card,
  CardActions,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Tooltip
} from "@mui/material";
import {
  KeyboardArrowDown
} from "@mui/icons-material";
import React, { ReactNode } from "react";
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import ListItemActions from '../ListItemActions';
import { StepOutput } from "../types";

// reuse from types?
interface TranslationStepComponentProps {
  fieldname: string;
  stepConfig: ReactNode;
  output: StepOutput | undefined;
  first?: boolean;
  last?: boolean;
}

function TranslationStepComponent(props: TranslationStepComponentProps) {
  const { t } = useTranslation();
  
  const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));
  

  return (
    <Card
      sx={{ display: "flex"}}
    >
      <CardContent
        sx={{ flex: 1 }}
      >
        {props.stepConfig}
        <Divider>
          <Tooltip title={t('selection-step.tooltip.show-output')}>
            <IconButton>
              <KeyboardArrowDown/>
            </IconButton>
          </Tooltip>
        </Divider>
        <Collapse in={true}>
          {/* Maybe create a separate StepOutput component */}
            <Paper
              sx={{
                display: "flex",
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
              }}
              component="ul"
            >
            {
              props.output === undefined ?
              <Skeleton variant="rectangular" animation="wave" /> :
              props.output.values.map((value, index) => {
                return (
                  <ListItem
                    key={index}
                  >
                    <Chip
                      label={value}
                    />
                  </ListItem>
                );
              })
            }
            </Paper>
      </Collapse>
      </CardContent>
      <Divider variant="middle" orientation="vertical" flexItem />
      <CardActions>
        <ListItemActions
          keyPrefix='translation-step'
          first={props.first}
          last={props.last}
          editable={true}
          sx={{
            display: "flex",
            flexDirection: "column"
          }}
        />
      </CardActions>
    </Card>
  )
}

export default TranslationStepComponent;