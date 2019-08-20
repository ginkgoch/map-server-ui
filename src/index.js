import React from "react";
import ReactDOM from "react-dom";
import { Button, Layout, Drawer } from "antd";
import Logo from "./components/Logo";
import "./index.css";
import ResourceMenu from './components/ResourceMenu';

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
            <ResourceMenu></ResourceMenu>
          </Drawer>
        </div>
      </Content>
    </Layout>
  );
};

ReactDOM.render(<HelloComponent />, document.querySelector("#container"));
