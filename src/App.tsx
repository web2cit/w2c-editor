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
  // a subcomponent, and... passing the domain object as prop
  
  // NOTE: or maybe better, have the top-most component ready to generate the
  // data model in at least three different ways:
  // * using the web2cit library
  // * fetching data from the translation server
  // * fething and sending data to the translation server
  // hence, the second component in the hierarchy, gets the data model and
  // renders it. this second component should keep config values in local state
  // and pass them back to the top-level component when new outputs are needed
  // in some cases, the top-level component wont' be prepared to generate new
  // outputs, in which case it will pass an incomplete data model as prop to the
  // subcomponent, which will render partially (no sorting, no outputs)
  // sorting into patterns should be part of the props passed to the subcomponent
  // the subcomponent should known if it is to be editable or not

  // what the refresh button in the header does depends on the mode
  // * the mode with the w2c library reloads the configuration files from Meta
  // * the mode simply showing the server results reloads the server response

  // the subcomponent should then be able to be rendered manually, in a way independent
  // of how the data model was generated

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
        // an array of templates
        // an array of targets (template + test paths)
        // pathToPattern mapping (treat separately, may not be available)
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
