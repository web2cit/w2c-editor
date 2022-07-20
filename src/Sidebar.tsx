import React from 'react';
import { AppBar, Box, Divider, TextField, Toolbar, Typography } from "@mui/material";
import { ConfigHeader } from "./header/ConfigHeader";
import { ConfigViewer } from "./viewer/ConfigViewer";
import { TargetResultsComponent } from "./result/TargetResultsComponent"
import {
  ConfigMetadata,
  PatternConfig,
  TargetFieldOutput,
  TemplateConfig,
  TestConfig,
} from "./types";

interface SidebarProps {
  domain: string;
  currentPath: string | undefined;  // undefined for standalone editor?
  selectedPath: string | undefined;  // make state rather than prop
  config: {  // config metadata
    patterns: ConfigMetadata;
    templates: ConfigMetadata;
    tests: ConfigMetadata;
  }
  // fallback - move to context?
  fallbackPattern: boolean;
  fallbackTemplate: boolean;
  //
  patterns: PatternConfig[];
  templates: Template[];
  targets: Target[];
}

interface Template extends TemplateConfig {
  pattern: string | undefined;
}

interface Target {
  path: string;
  // sorting
  pattern: string | undefined;
  template: string | undefined;
  //
  test: TestConfig;  // move out?
  //
  score: number | undefined  // shortcut to applicable output score
  // 
  // for a given target, consider making available only the template outputs
  // that were tried for it;
  outputs: { // in the order in which they were returned
    template: string | undefined;
    fields?: TargetFieldOutput[]
  }[];
}

// the header should collapse to a minimum
// expression of domain + small config cards
// (just config name and whether to save or not)
// when user scrolls down

// NOTE: consider having two separate components:
// the overview component, and the target component
// when editing a template we don't want to wait until output for all targets has been processed
// when focused on a specific target, process outputs for that target only
// if done so, we may pass targetresults to the target component including the templateconfig

// likewise, we don't want to refresh patterns if its templates/tests have not changed
// for the overview viewer we may want targets nested into template into patterns

export function Sidebar(props: SidebarProps) {
  const currentUrl = "https://" + props.domain + props.currentPath;
  
  // change tsconfig to consider possibly undefined index
  const selectedTarget = props.targets.filter(
    (target) => target.path === props.selectedPath
  )[0];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1
      }}
    >
      {/* move appbar to separate component */}
      <AppBar position="static" >
        <Toolbar
          sx={{ gap: 1 }}
        >
          <Typography variant="h6" >
            Web2Cit
          </Typography>
          <TextField
            label={"Current URL"}
            value={currentUrl}
            size="small"
            variant="outlined"
            fullWidth
          />
        </Toolbar>
      </AppBar>
      <ConfigHeader
        domain={props.domain}
        patternConfig={props.config.patterns}  // use ConfigMetadata in ConfigHeader
        templateConfig={props.config.templates}
        testConfig={props.config.tests}
      />
      <Divider />
      <ConfigViewer
        fallbackPattern={props.fallbackPattern}
        fallbackTemplate={props.fallbackTemplate}
        patterns={
          props.patterns
        }
        templates={
          props.templates
        }
        targets={props.targets}
        currentPath={"/article1"}
      />
      <Divider />
      {
        props.selectedPath &&
        <TargetResultsComponent
          target={props.targets.filter(
            (target) => target.path === props.selectedPath
          )[0]}
          templates={props.templates}  // do we have to pass all templates?
      />
      }
    </Box>    
  );
  // add footer
};
