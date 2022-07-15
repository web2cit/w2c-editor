import React from 'react';
import { AppBar, Box, Divider, TextField, Toolbar, Typography } from "@mui/material";
import { ConfigHeader } from "./header/ConfigHeader";
import { ConfigViewer } from "./viewer/ConfigViewer";
import { TargetResultComponent } from "./result/TargetResult"

interface ConfigRevision {
  id: number;
  timestamp: Date;
}

interface ConfigMetadata {  // I don't like "metadata"
  revisions: ConfigRevision[];
  revid: number | undefined;  // currently shown revision
  changed: boolean;
}

interface SelectionConfig extends StepConfig {};
interface TransformationConfig extends StepConfig {
  itemwise: boolean;
}
interface StepConfig {
  type: string;
  args: {
    value: string;
    error?: Error;
  }
}

interface StepOutput {
  values: string[];  // is there empty output if error?
  error?: Error;
}

interface FieldOutputValue {
  value: string;
  valid: boolean;
}

interface ResultField {
  name: string;
  output: {
    values: FieldOutputValue[];
    // valid: boolean;  // may get it from the output values
    // error?: Error;  // may get it from the procedure steps
    procedures: {
      selections: StepOutput[];
      transformations: StepOutput[];
    }[];
  };
  goal: FieldOutputValue[] | undefined;
  applicable: boolean;
  score: number | undefined;
}

interface TemplateField {
  name: string;
  procedures: {
    selections: SelectionConfig[];
    transformations: TransformationConfig[];
  }[];
}

interface TargetResult {
  template: string;  // it may be different than the one it is sorted into
  // applicable: boolean;
  // score: number | undefined;
  fields: ResultField[];
};

interface Target {
  path: string;
  // sorting
  pattern: string | undefined;
  template: string | undefined;
  // score: number | undefined;  // we need this because we may change the template used for translation
  // but we still want to have the score for the default template in the viewer
  // this would reinforce the idea of having the template outputs in the templates, not in the targets
  // or having multiple target results below
  // template output
  results: TargetResult[];  // do we want an array of results, for example to preview applicability/score in the template selector?
}

interface TranslationTemplate {
  path: string;
  label?: string;
  pattern: string | undefined;  // is it OK to have sorting info here?
  fields: TemplateField[];
}

interface SidebarProps {
  domain: string;
  currentPath: string | undefined;  // undefined for standalone editor?
  selectedPath: string | undefined;  // make state rather than prop
  config: {  // config metadata
    patterns: ConfigMetadata;
    templates: ConfigMetadata;
    tests: ConfigMetadata;
  }
  patterns: {
    pattern: string;  // we may not include fallback pattern in the configuration
    label?: string;
  }[];
  templates: TranslationTemplate[];
  targets: Target[]
}

// the header should collapse to a minimum
// expression of domain + small config cards
// (just config name and whether to save or not)
// when user scrolls down

export function Sidebar(props: SidebarProps) {
  const currentUrl = "https://" + props.domain + props.currentPath;
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
        fallbackPattern={true}
        patterns={
          props.patterns
        }
        templates={
          props.templates
        }
        targets={
          props.targets
        }
        currentPath={"/article1"}
      />
      <Divider />
      <TargetResultComponent
        // the template selector and the result should be separate components
        path={props.selectedPath}
        templates={props.templates.filter((template) => template.pattern === "")} // available templates (for the current pattern); what about fallback!?
        // templatePath={"/article1"}  // the template path selected to use
        results={props.targets.filter((target) => target.path === props.selectedPath)}
        // the fields must be selected inside based on the template chosen
      />
    </Box>    
  );
  // add footer
};
