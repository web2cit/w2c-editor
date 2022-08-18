import React, { useEffect } from 'react';
import './App.css';
import { AppBar, Box, Divider, Toolbar, Typography } from "@mui/material";
import { ConfigHeader } from "./header/ConfigHeader";
import { ConfigViewer } from "./viewer/ConfigViewer";
import { useAppDispatch } from './app/hooks';
import { setDomain } from './app/domainSlice';

// the header should collapse to a minimum
// expression of domain + small config cards
// (just config name and whether to save or not)
// when user scrolls down

interface AppProps {
  // mode: "sidebar" | "standalone"

  // whether we should provide options to edit the configuration files
  // or (false) just offer a link to modify them externally
  // editable: boolean
}

function App(props: AppProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // note that in development mode react will call this twice on mount
    // see https://stackoverflow.com/questions/72238175/react-18-useeffect-is-getting-called-two-times-on-mount
    // and https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state
    dispatch(setDomain('www.elespectador.com'));

    // fixme?: once the domain has been set, should other actions (e.g., catchallSet,
    // fetchRevisions, etc) be called from withing the setDomain thunk action
    // (current approach) or from  here?

    // todo: load config state persisted from localstorage

  }, [dispatch])

  // const currentUrl = "https://" + props.domain + props.currentPath;

  // todo: bring the sidebar contents in here
  return(
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
          {/* <TextField
            label={"Current URL"}
            value={currentUrl}
            size="small"
            variant="outlined"
            fullWidth
          /> */}
        </Toolbar>
      </AppBar>
      <ConfigHeader
        // domain={props.domain}
        // patternConfig={props.config.patterns}  // use ConfigMetadata in ConfigHeader
        // templateConfig={props.config.templates}
        // testConfig={props.config.tests}
      />
      <Divider />
      {
      // NOTE: consider having two separate components:
      // the overview component, and the target component
      // when editing a template we don't want to wait until output for all targets has been processed
      // when focused on a specific target, process outputs for that target only
      // if done so, we may pass targetresults to the target component including the templateconfig
      // likewise, we don't want to refresh patterns if its templates/tests have not changed
      // for the overview viewer we may want targets nested into template into patterns
      
      /* {
        selectedPath ?
        <TargetView
          pattern= // PatternConfig
          template= // 
          
        /> :
        <OverviewView
          patterns={}
        />
      } */}


      <ConfigViewer
        // fallbackPattern={props.fallbackPattern}
        // fallbackTemplate={props.fallbackTemplate}
        // patterns={
        //   props.patterns
        // }
        // templates={
        //   props.templates
        // }
        // targets={props.targets}
        // currentPath={"/article1"}
      />
      <Divider />
      {/* {
        props.selectedPath &&
        <TargetResultsComponent
          target={props.targets.filter(
            (target) => target.path === props.selectedPath
          )[0]}
          templates={props.templates}  // do we have to pass all templates?
      />
      } */}
    </Box>    
  );
  // add footer
};

export default App;