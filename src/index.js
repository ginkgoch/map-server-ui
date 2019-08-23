import _ from 'lodash';
import React from "react";
import ReactDOM from "react-dom";
import { Layout, Drawer } from "antd";
import Logo from "./components/Logo";
import {Layers} from './components/sidebar';
import * as mapJSON from './resources/map.json';
import "./index.css";
import { FillStyle } from './components/styles';

const { Header, Content } = Layout;

// let HelloComponent = () => {
class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { styleEditPanelVisible: false, editingStyleName: '' };
  } 

  render() {
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
              width="280px"
              visible={true}
              mask={false}
              closable={false}
              getContainer={() => document.querySelector('#content')}
              style={{ position: "absolute" }}
            >
              <Layers layers={_.flatMap(mapJSON.groups, g => g.layers)} onEditButtonClick={ this.editStyle() }></Layers>
              <Drawer
                title={"Edit Style " + this.state.editingStyleName}
                width="360px"
                placement="left"
                visible={this.state.styleEditPanelVisible}
                closable={true}
                getContainer={() => document.querySelector('#content')}
                style={{ position: "absolute" }} onClose={this.showStyleEditPanel.bind(this, false)}>
                  <div style={{paddingTop: 24}}>
                    <FillStyle></FillStyle>
                  </div>
                </Drawer>
            </Drawer>
          </div>
        </Content>
      </Layout>
    );
  }

  editStyle() {
    return styleName => {
      this.state.editingStyleName = styleName;
      this.setState(this.state);
      this.showStyleEditPanel(true);
    }
  }

  showStyleEditPanel(visible = false) {
    this.state.styleEditPanelVisible = visible;
    this.setState(this.state);
  }
}

ReactDOM.render(<AppComponent />, document.querySelector("#container"));
