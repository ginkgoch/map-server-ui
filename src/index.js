import "./index.css";
import _ from 'lodash';
import React from "react";
import ReactDOM from "react-dom";
import { MapEditor, MapList } from './components/pages';
import { BrowserRouter, Route } from 'react-router-dom';
import { Config } from "./shared";

window.GKGlobal = Object.assign({}, Config);
ReactDOM.render(
    <BrowserRouter>
      <Route exact path="/" component={MapList} />
      <Route path="/maps/:mapID" component={MapEditor} />
    </BrowserRouter>,
    document.querySelector("#container")
  );
