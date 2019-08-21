import _ from 'lodash';
import React from "react";
import ReactDOM from "react-dom";
import { Button, Layout, Drawer } from "antd";
import Logo from "./components/Logo";
import {Layers} from './components/sidebar';
import * as mapJSON from './resources/map.json';
import "./index.css";

const { Header, Content } = Layout;

let HelloComponent = () => {
  return (
    <Layout>
      <Header id="header">
        <Logo />
      </Header>
      <Content>
        <div id="content" style={{position: "relative", height: "100%"}}>
          <Drawer
            placement="left"
            title="Resources"
            visible={true}
            mask={false}
            closable={false}
            getContainer={() => document.querySelector('#content')}
            style={{ position: "absolute" }}
          >
            <Layers layers={_.flatMap(mapJSON.groups, g => g.layers)}></Layers>
          </Drawer>
        </div>
      </Content>
    </Layout>
  );
};

ReactDOM.render(<HelloComponent />, document.querySelector("#container"));
