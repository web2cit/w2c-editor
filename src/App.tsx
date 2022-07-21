import React from 'react';
import './App.css';
import { AppBar, Box, Divider, TextField, Toolbar, Typography } from "@mui/material";
import { ConfigHeader } from "./header/ConfigHeader";
import { ConfigViewer } from "./viewer/ConfigViewer";
import { TargetResultsComponent } from "./result/TargetResultsComponent"
import { Sidebar } from "./Sidebar";
import { PatternConfig } from './types';
import { Domain } from 'web2cit';

// the header should collapse to a minimum
// expression of domain + small config cards
// (just config name and whether to save or not)
// when user scrolls down

interface AppProps {
  currentUrl: string | undefined;
  fallbackPattern: PatternConfig | undefined,
  fallbackTemplate: TemplateConfig | undefined,
}

function App() {
  // because we don't want the domain object to be reinstantiated every time
  // the component it belongs to re-renders, consider moving everything else to
  // a subcomponent, and passing the domain object as prop
  const [ domain, setDomain ] = useState<Domain>();

  // TODO: persist some of the state to localstorage:
  // * the json representation of the config values
  // * ...?

  // list of config revisions available
  const [ patternConfigRevisions, setPatternConfigRevisions ] = useState();
  const [ templateConfigRevisions, setTemplateConfigRevisions ] = useState();
  const [ testConfigRevisions, setTestConfigRevisions ] = useState();

  // currently selected config revisions
  // TODO: we probably don't need to know this here (move to config cards?)
  // but we need to respond to changes by updating the config arrays
  const [ patternConfigRevid, setPatternConfigRevid ] = useState();
  const [ templateConfigRevid, setTestConfigRevid ] = useState();
  const [ testConfigRevid, setTestConfigRevid ] = useState();

  // whether configs have changed
  // TODO: we may know this from whether we have a revid selected or not
  // but what happens with unconfigured domains?

  function handleRevidChange(
    config: "patterns" | "templates" | "tests",
    revid: number
  ) {
    // * make the Domain object fetch the revision data and load it
    // * if applicable, update local state with config values
    // * if patterns changed, we may need to update how paths (templates, tests, current path) sort into them
    // * if templates changed, we may need to update template config and template outputs, for pattern they belong to
    // * if tests changed, we need to update test config and test outputs
  }

  // TODO: do we need these? or will they be kept by the Domain object?
  // should our decision be determined by how we will persist state to local storage?
  const [ patterns, setPatterns ] = useState();
  const [ templates, setTemplates ] = useState();
  
  // we may want to equate tests to targets (without its results)
  // but it may bring problems when dealing with empty tests
  const [ tests, setTests ] = useState();

  const [ selectedTarget, setSelectedTarget ] = useState();

  const [ templateOutputsByTarget, setTemplateOutputsByTarget ] = useState<Map<string, Map<string, TemplateOutput>>();
  
  // if the testoutput object doesn't change, components down the road
  // may not need to be updated
  const [ testOutputsByTarget, setTestOutputsByTarget ] = useState<Map<string, TestOutput>();

  
  targetResults // calculated from template and test outputs above?

  // handlePatternAdd()

  // handlePatternRemove()

  // handlePatternMove()

  // handlePatternUpdate()

  // handleTemplateAdd(template: TemplateConfig) {
  //   // in addition to adding the template to the domain object
  //   // this should trigger revision change checking
  //   // templates state update
  //   // update list of targets
  //   // update template outputs for the targets in the same pattern
  // }

  // handleTemplateRemove(path: string) {
  //   // trigger revision change checking
  //   // templates state update
  //   // update list of targets
  //   // update template outputs for corresponding pattern
  // }

  // handleTemplateMove() {
  //   // idem
  // }

  // handleTemplateUpdate() {
  //   // idem
  //   // we may update individual parts, but we won't for now
  // }
  
  // handleTestAdd()

  // handleTestRemove()

  // handleTestUpdate()

  return (
    <Box>
      <Toolbar
        // currentUrl
      ></Toolbar>
      <ConfigHeader
        // config revisions
        // selected revids
        // revid change handler
        // config save handler
      />
    {
      selectedTarget ?
      <OverviewView
        // an array of patterns
        // an array of templates, including the pattern to which each belongs
        // an array of targets, including the pattern to wich each belongs
        // an array of target results, use this to sort targets into templates
      /> :
      <TargetView
        // path
        // pattern id
        // test config
        // pattern templates
        // results, use this to decide preferred template
      />
    }
    </Box>
  );
}

export default App;
