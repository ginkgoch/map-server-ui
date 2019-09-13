import _ from "lodash";
import React from "react";
import { Layout, Drawer, Spin, Popover, Icon, Modal } from "antd";
import Logo from "../header/Logo";
import { Layers } from "../sidebar";
import { NoneStyle } from "../styles";
import { LaunchButton } from "../header/LaunchButton";
import "../../index.css";
import { MapsService } from "../../services/maps/MapsService";

const { Header, Content } = Layout;

const SideBarHeader = props => {
  return (
    <div className="sidebar-title">
      <span>Resources</span>
      <Spin size="small" spinning={props.loading}></Spin>
    </div>
  );
};

export class MapEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      styleEditPanelVisible: false,
      secondaryDrawerTitle: "",
      editingStyleName: "",
      mapModel: null,
      mapModelLoading: true,
      savingMapModel: false,
      savingMapModelError: '',
      editStyleComponent: <NoneStyle />
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
              title={<SideBarHeader loading={this.state.mapModelLoading} />}
              width="280px"
              visible={true}
              mask={false}
              closable={false}
              getContainer={"#content"}
              style={{ position: "absolute" }}
            >
              <Layers
                layers={layers}
                showStyleEditPanel={this.showStyleEditPanel.bind(this)}
              />
              <Drawer
                title={
                  this.state.secondaryDrawerTitle +
                  " - " +
                  this.state.editingStyleType
                }
                width="360px"
                placement="left"
                visible={this.state.styleEditPanelVisible}
                closable={false}
                style={{ position: "absolute" }}
                getContainer={"#content"}
                onClose={this.showStyleEditPanel.bind(this, false)}
              >
                <div style={{ paddingTop: 24 }}>
                  {this.state.editStyleComponent}
                </div>
              </Drawer>
            </Drawer>
          </div>
        </Content>
      </Layout>
    );
  }

  showStyleEditPanel(
    visible = false,
    editStyleComponent = null,
    editingStyleType = "",
    secondaryDrawerTitle = "Edit Style"
  ) {
    if (!visible) {
      this.setState({ styleEditPanelVisible: visible });
    } else {
      this.setState({
        styleEditPanelVisible: visible,
        editStyleComponent,
        editingStyleType,
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
      map.groups = [{
        "type": "layer-group",
        "name": "Default",
        "visible": true
      }];
    }
  }
}