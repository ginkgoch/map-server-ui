import "../../index.css";
import _ from "lodash";
import React from "react";
import { Layout, Drawer, Spin, Popover, Icon, Modal, Button } from "antd";
import Logo from "../header/Logo";
import { Layers } from "../sidebar";
import { NoneStyle } from "../styles";
import { LaunchButton } from "../header/LaunchButton";
import { MapsService } from "../../services/MapsService";
import { DataSources } from "../sidebar/DataSources";
import { SideBarHeader } from '../sidebar';
import { LayerTemplates } from "../../templates";

const { Header, Content } = Layout;

export class MapEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      secondaryDrawerVisible: false,
      secondaryDrawerTitle: "",
      mapModel: null,
      mapModelLoading: true,
      savingMapModel: false,
      savingMapModelError: '',
      secondaryDrawerChild: <NoneStyle />
    };
  }

  async componentDidMount() {
    const mapID = this.props.match.params.mapID;
    const response = await MapsService.getMapByID(mapID);
    if (response.status === 200) {
      const mapModel = response.data;
      this.normalizeGroups(mapModel)
      this.setState({ mapModel, mapModelLoading: false });
    }

    this.initSaveMapModelHandler();
  }

  render() {
    const layers = this.state.mapModel ? this.state.mapModel.content.groups[0].layers : [];
    const title = this.state.mapModel ? this.state.mapModel.name : "Unknown";
    const description = (<div style={{ width: 480 }}>{this.state.mapModel ? this.state.mapModel.description : ''}</div>);

    return (
      <Layout>
        <Header id="header" style={{ borderBottom: "1px solid #e8e8e8" }}>
          <div className="header-title">
            <h1>
              {title}
              <Popover content={description} placement="bottom" trigger="click">
                <Icon style={{ marginLeft: 6 }} type="more" />
              </Popover>
            </h1>
          </div>
          <LaunchButton />
          <Logo />
        </Header>
        <Content>
          <div id="content" style={{ position: "relative", height: "100%" }}>
            <Drawer
              placement="left"
              title={<SideBarHeader loading={this.state.mapModelLoading} onAddLayerClick={() => this.onAddLayerClick()} />}
              width="280px"
              visible={true}
              mask={false}
              closable={false}
              getContainer={"#content"}
              style={{ position: "absolute" }}
            >
              <Layers
                layers={layers}
                showStyleEditPanel={this.showSecondaryDrawer.bind(this)}
              />

              {/* <DataSources /> */}
              <Drawer
                title={
                  this.state.secondaryDrawerTitle +
                  " - " +
                  this.state.secondaryDrawerSubTitle
                }
                width="360px"
                placement="left"
                visible={this.state.secondaryDrawerVisible}
                closable={false}
                style={{ position: "absolute" }}
                getContainer={"#content"}
                onClose={this.showSecondaryDrawer.bind(this, false)}
              >
                <div style={{ paddingTop: 16 }}>
                  {this.state.secondaryDrawerChild}
                </div>
              </Drawer>
            </Drawer>
          </div>
        </Content>
      </Layout>
    );
  }

  async onReSaveButtonClick(e, errorModal) {
    e.preventDefault();
    e.stopPropagation();

    try {
      console.log(this);
      this.setState({savingMapModel: true, savingMapModelError: ''});
      const response = await MapsService.updateMap(this.state.mapModel);
      if (response.status === 200) {
        errorModal.destroy();
      }
    }
    catch (ex) {
      this.setState({savingMapModelError: ex.toString()});
    }
    finally {
      this.setState({savingMapModel: false});
    }
  }

  onAddLayerClick() {
    this.showSecondaryDrawer(true, 
      (<DataSources onConfirm={newLayers => this.onAddLayerConfirm(newLayers)} />), 
      'New Layer', 
      'Data Sources');
  }

  onAddLayerConfirm(newLayersDef) {
    if (!newLayersDef || newLayersDef.length === 0) {
      return;
    }

    const mapModel = this.state.mapModel;
    const newLayers = newLayersDef.map(def => {
      const source = LayerTemplates.getFeatureSource(def.sourceType, def.name, def.path, def.srs);
      const layer = LayerTemplates.getFeatureLayer(def.name, source);
      return layer;
    });

    const group = mapModel.content.groups[0];
    if (group.layers === undefined) {
      group.layers = [];
    }

    group.layers.push(...newLayers);

    this.setState({ mapModel });
    this.showSecondaryDrawer(false);
    window.ginkgoch.saveCurrentMapModel();
  }

  showSecondaryDrawer(
    visible = false,
    secondaryDrawerChild = null,
    secondaryDrawerSubTitle = "",
    secondaryDrawerTitle = "Edit Style"
  ) {
    if (!visible) {
      this.setState({ secondaryDrawerVisible: visible });
    } else {
      this.setState({
        secondaryDrawerVisible: visible,
        secondaryDrawerChild,
        secondaryDrawerSubTitle,
        secondaryDrawerTitle
      });
    }
  }

  normalizeGroups(mapModel) {
    const map = _.result(mapModel, 'content');
    if (map === undefined) {
      return;
    }

    if (!map.groups) {
      map.groups = [LayerTemplates.getGroup()];
    }
  }

  initSaveMapModelHandler() {
    const that = this;
    window.ginkgoch = {
      savingTimeoutID: null,
      saveCurrentMapModel: () => {
        if (this.savingTimerID) {
          clearTimeout(this.savingTimerID);
        }
        this.savingTimerID = setTimeout(async () => {
          this.savingTimerID = null;
          try {
            await MapsService.updateMap(that.state.mapModel);
          }
          catch (ex) {
            that.setState({
              savingMapModelError: ex.toString()
            })
            const errorModal = Modal.error({
              title: 'Save Map Failed',
              content: (
                <div>
                  <div>Latest map status is not synchronized with server with following err. Click &nbsp;
                    <a onClick={e => that.onReSaveButtonClick(e, errorModal)}>here</a> to save again or refresh current page to sync with latest state.</div>
                  <p style={{marginTop: 8}}>{that.state.savingMapModelError}</p>
                </div>
              )
            })
          }
        }, 1000);
      }
    }
  }
}