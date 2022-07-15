import React from 'react';
import './App.css';
import { AppBar, Box, Divider, TextField, Toolbar, Typography } from "@mui/material";
import { ConfigHeader } from "./header/ConfigHeader";
import { ConfigViewer } from "./viewer/ConfigViewer";
import { TargetResultComponent } from "./result/TargetResult"
import { Sidebar } from "./Sidebar";

const props = {
  url: "https://www.example.com/article1",
  domain: "www.example.com",
  storage: "https://meta.mediawiki.org/wiki/Web2Cit/data",  // needed?
  patterns: {
    revisions: [],
    revid: undefined,
    changed: false,
    patterns: []
  },
  templates: {
    revisions: [],
    revid: undefined,
    changed: false,
    templates: []
  },
  tests: {
    revisions: [],
    revid: undefined,
    changed: false,
    tests: []
  }
}

// the header should collapse to a minimum
// expression of domain + small config cards
// (just config name and whether to save or not)
// when user scrolls down

function App() {
  return (
    <Sidebar
    
    />
  );
}

export default App;
