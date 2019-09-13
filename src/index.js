import "./index.css";
import _ from 'lodash';
import React from "react";
import ReactDOM from "react-dom";
import { MapEditor, MapList } from './components/pages';
import { BrowserRouter, Route } from 'react-router-dom';

const App = (props) => {
    <div>
        {props.children}
    </div>
};

ReactDOM.render((
    <BrowserRouter>
        <Route path="/" component={ App }>
            <Route exact path="/" component={ MapList } />
            <Route path="/maps/:mapID" component={ MapEditor } />
        </Route>
    </BrowserRouter>
), document.querySelector("#container"));
