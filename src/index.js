import "./index.css";
import _ from 'lodash';
import React from "react";
import ReactDOM from "react-dom";
import { MapEditor, MapList, Playground } from './components/pages';
import { BrowserRouter, Route } from 'react-router-dom';
import { Config, GKGlobalData } from "./shared";

GKGlobalData.init();
ReactDOM.render(
  <BrowserRouter>
    <Route exact path="/" component={MapList} />
    <Route path="/maps/:mapID" component={MapEditor} />
    <Route path="/playground" component={Playground} />
  </BrowserRouter>,
  document.querySelector("#container")
);