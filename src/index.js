import _ from 'lodash';
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { MapEditor, MapList } from './components/pages';
import { BrowserRouter, Route } from 'react-router-dom';

ReactDOM.render((
    <BrowserRouter>
        <Route path="/" component={ MapList } />
        <Route path="/maps/:mapID" component={ MapEditor } />
    </BrowserRouter>
), document.querySelector("#container"));
