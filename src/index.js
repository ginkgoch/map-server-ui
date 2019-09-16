import "./index.css";
import _ from 'lodash';
import React from "react";
import ReactDOM from "react-dom";
import { MapEditor, MapList } from './components/pages';
import { BrowserRouter, Route } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
      <Route exact path="/" component={MapList} />
      <Route path="/maps/:mapID" component={MapEditor} />
    </BrowserRouter>,
    document.querySelector("#container")
  );
