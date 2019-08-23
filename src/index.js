import _ from 'lodash';
import React from "react";
import ReactDOM from "react-dom";
import { Layout, Drawer } from "antd";
import Logo from "./components/Logo";
import { Layers } from './components/sidebar';
import * as mapJSON from './resources/map.json';
import "./index.css";
import { FillStyle, NoneStyle, LineStyle } from './components/styles';

const { Header, Content } = Layout;

class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      styleEditPanelVisible: false, 
      editingStyleName: '', 
      layers: _.flatMap(mapJSON.groups, g => g.layers),
      editStyleComponent: <NoneStyle /> };
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
              <Layers layers={this.state.layers} onEditButtonClick={this.editStyle()}></Layers>
              <Drawer
                title={"Edit Style " + this.state.editingStyleName}
                width="360px"
                placement="left"
                visible={this.state.styleEditPanelVisible}
                closable={true}
                getContainer={() => document.querySelector('#content')}
                style={{ position: "absolute" }} onClose={this.showStyleEditPanel.bind(this, false)}>
                <div style={{ paddingTop: 24 }}>
                  {
                    this.state.editStyleComponent
                  }
                </div>
              </Drawer>
            </Drawer>
          </div>
        </Content>
      </Layout>
    );
  }

  editStyle() {
    return (style, layer) => {
      this.state.editingStyleName = this.getStyleTypeName(style);
      this.state.editStyleComponent = this.getStyleComponent(style, layer);
      this.setState(this.state);
      this.showStyleEditPanel(true);
    }
  }

  showStyleEditPanel(visible = false) {
    this.state.styleEditPanelVisible = visible;
    this.setState(this.state);
  }

  getStyleComponent(style, layer) {
    style = _.cloneDeep(style);

    const onEditStyleCanceled = this.showStyleEditPanel.bind(this, false);
    const onEditStyleSubmit = (newStyle => {
      const index = layer.styles.findIndex(s => s.id === newStyle.id);
      layer.styles[index] = newStyle;

      this.setState(this.state);
      this.showStyleEditPanel(false);
    }).bind(this);

    switch (style.type) {
      case 'fill-style':
        return <FillStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onEditStyleSubmit} />
      case 'line-style':
        return <LineStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onEditStyleSubmit} />
    }
  }

  getStyleTypeName(style) {
    switch(style.type) {
      case 'fill-style': return 'Fill Style';
      case 'line-style': return 'Line Style';
      case 'point-style': return 'Point Style';
      case 'icon-style': return 'Icon Style';
      case 'class-break-style': return 'Class Break Style';
      case 'value-style': return 'Value Style';
      default:
        return style.type;
    }
  }
}

ReactDOM.render(<AppComponent />, document.querySelector("#container"));
