import "./index.css";
import _ from 'lodash';
import React from "react";
import ReactDOM from "react-dom";
import { MapEditor, MapList, Playground, SignUp, SignIn } from './components/pages';
import { BrowserRouter, Route } from 'react-router-dom';
import { GKGlobal } from "./shared";

GKGlobal.init();
ReactDOM.render(
  <BrowserRouter>
    <Route exact path="/" component={MapList} />
    <Route path="/maps/:mapID" component={MapEditor} />
    <Route path="/users/signup" component={SignUp} />
    <Route path="/users/signin" component={SignIn} />
    <Route path="/playground" component={Playground} />
  </BrowserRouter>,
  document.querySelector("#container")
);