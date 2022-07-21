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

// We may have different top-level "apps", depending on how we generate the
// data model passed to the second-level component:
// * using the web2cit library
// * fetching data from the translation server (read only)
// * fething and sending data to the translation server

// do we want this top-level component to be a class component? this way we
// could have it follow an interface and make sure all methods/functions are
// implemented
function App() {
  // what the refresh button in the header does depends on the mode
  // * the mode with the w2c library reloads the configuration files from Meta
  // * the mode simply showing the server results reloads the server response

  handleRefresh() {
    // fetch configuration revisions again
    // what should we do if there is a new revision?
    // we should consider whether the user has made changes
    // and maybe ask them whether we should overwrite them
    // update the patterns/templates/tests props accordingly
    // maybe also update pathToPattern and outputsByTarget
  }

  // should the domain object be part of the top-level component's state?
  const [ domain, setDomain ] = useState<Domain>();

  // should the props passed to the subcomponent be part of the top-level
  // component's state? if not, what would trigger re-rendering of the sub-
  // component?

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

function SubComponent (props: {
  // whether we should provide options to edit the configuration files
  // or (false) just offer a link to modify them externally
  editable: boolean

  //
  domain: // domain name

  // the problem with keeping a local state with configuration values and only
  // submitting them to the core when updates are needed, is that either we have
  // to make our own validation of values, or we may find out late that they
  // were wrong...

  // also, step arguments may have errors too, which we may not find out
  // until the core has been involved...

  // we may include pattern sorting inside these config values
  // or pass a separate pathToPattern map
  patterns:
  templates:
  tests:  // or targets including test

  //
  outputsByTarget  

  // instructs the core at the top-level app that a specific config revision
  // wants to be loaded
  onPatternsRevidChange
  onTemplatesRevidChange
  onTestsRevidChange

  // on refresh
  onRefresh: // action triggered when the refresh button at the top is pressed
  // consider having separate buttons per config file
  // do we need extra refresh buttons? for example next to each target?

  // these functions lead to corresponding prop updates, and may return errors
  // they may have a parameter to not automatically update outputs
  // or to limit update to a single target
  // and we need independent functions to refresh sorting/outputs
  // Note that having so many of these functions imply reimplementing all of
  // them on each top-level component. Makes sense?
  onPatternAdd
  onPatternRemove
  onPatternMove
  onPatternUpdate

  onTemplateAdd:
  onTemplateRemove:
  onTemplateMove:
  onTemplateUpdate:

  onTestAdd
  onTestRemove
  onTestMove
  onTestUpdate

  //
  refreshSorting: (
    patterns: PatternConfig[];
    paths: string[];    
  ): void;
  refreshOutput: 


}) {

}

// open questions
// local state for config values yes or not?
// maybe yes, but after validation from the core
// or maybe yes at the top-level "app"
// 




/// OLD NOTES

  // NO: because we don't want the domain object to be reinstantiated every time
  // the component it belongs to re-renders, consider moving everything else to
  // a subcomponent, and... passing the domain object as prop
  
  // hence, the second component in the hierarchy, gets the data model and
  // renders it.
  
  // NO: this second component should keep config values in local state
  // and pass them back to the top-level component when new outputs are needed

  // in some cases, the top-level component wont' be prepared to generate new
  // outputs, in which case it will pass an incomplete data model as prop to the
  // subcomponent, which will render partially (no sorting, no outputs)
  // sorting into patterns should be part of the props passed to the subcomponent
  // the subcomponent should known if it is to be editable or not

  // the subcomponent should then be able to be rendered manually, in a way independent
  // of how the data model was generated

