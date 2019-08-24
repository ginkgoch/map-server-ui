import _ from 'lodash';
import React from "react";
import ReactDOM from "react-dom";
import { Layout, Drawer } from "antd";
import Logo from "./components/Logo";
import { Layers } from './components/sidebar';
import { NoneStyle } from './components/styles';
import * as mapJSON from './resources/map.json';
import "./index.css";

const { Header, Content } = Layout;

class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      styleEditPanelVisible: false,
      editingStyleName: '',
      layers: _.flatMap(mapJSON.groups, g => g.layers),
      editStyleComponent: <NoneStyle />
    };
  }

  render() {
    return (
      <Layout>
        <Header id="header">
          <Logo />
        </Header>
        <Content>
          <div id="content" style={{ position: "relative", height: "100%" }}>
            <Drawer
              placement="left"
              title="Resources"
              width="280px"
              visible={true}
              mask={false}
              closable={false}
              getContainer={() => document.querySelector('#content')}
              style={{ position: "absolute" }}
            >
              <Layers layers={this.state.layers}
                showStyleEditPanel={this.showStyleEditPanel.bind(this)} />
              <Drawer
                title={"Edit Style " + this.state.editingStyleType}
                width="360px"
                placement="left"
                visible={this.state.styleEditPanelVisible}
                closable={true}
                getContainer={() => document.querySelector('#content')}
                style={{ position: "absolute" }} onClose={this.showStyleEditPanel.bind(this, false)}>
                <div style={{ paddingTop: 24 }}>{this.state.editStyleComponent}</div>
              </Drawer>
            </Drawer>
          </div>
        </Content>
      </Layout>
    );
  }

  showStyleEditPanel(visible = false, editStyleComponent = null, editingStyleType = '') {
    this.setState({ styleEditPanelVisible: visible, editStyleComponent, editingStyleType });
  }
}

ReactDOM.render(<AppComponent />, document.querySelector("#container"));
