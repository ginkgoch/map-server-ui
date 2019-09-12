import _ from "lodash";
import React from "react";
import { Layout, Drawer, Spin, Popover, Icon } from "antd";
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
      editStyleComponent: <NoneStyle />
    };
  }

  async componentDidMount() {
    const mapID = this.props.match.params.mapID;
    const response = await MapsService.getMapByID(mapID);
    if (response.status === 200) {
      this.setState({ mapModel: response.data, mapModelLoading: false });
    }
  }

  render() {
    const layers = this.state.mapModel
      ? _.flatMap(this.state.mapModel.content.groups, g => g.layers)
      : [];
    const title = this.state.mapModel ? this.state.mapModel.name : "Unknown";
    // const description = this.state.mapModel ? this.state.mapModel.description : '';
    const description = (
      <div style={{ width: 480 }}>
        Selim III, then Sultan of the Ottoman empire, engaged in many reforms
        and modernizations during his reign, and this 1803 atlas was the first
        known complete printed atlas in the Muslim world to use European-style
        cartography. Only 50 copies were printed, and many of these were burned
        in a warehouse fire during a Janissary uprising of those opposed to
        Selim’s reforms, so it is also one of the rarest printed atlases.
      </div>
    );

    return (
      <Layout>
        <Header id="header" style={{ borderBottom: "1px solid #e8e8e8" }}>
          <div className="header-title">
            <h1>
              {title}
              <Popover content={description} placement="bottom" trigger="click">
                <Icon style={{marginLeft: 6}} type="more" />
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
}