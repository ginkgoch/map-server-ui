import "../../index.css";
import _ from "lodash";
import React from "react";
import { Layout, Drawer, Popover, Icon, Modal } from "antd";
import Logo from "../header/Logo";
import { Layers } from "../sidebar";
import { NoneStyle, StyleUtils } from "../styles";
import { LaunchButton } from "../header/LaunchButton";
import { MapsService } from "../../services/MapsService";
import { DataSources } from "../sidebar/DataSources";
import { SideBarHeader } from "../sidebar";
import { LayerTemplates } from "../../templates";
import { MapView } from "../map/MapView";
import { Config, GKGlobalData } from "../../shared";
import { DataTable } from "../properties";

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
      savingMapModelError: "",
      secondaryDrawerChild: <NoneStyle />,
      dataTableModel: {},
      dataTableDrawerVisible: false,
      highlights: LayerTemplates.getFeatureCollection()
    };
  }

  async componentDidMount() {
    const mapID = this.props.match.params.mapID;
    const response = await MapsService.getMapByID(mapID);
    if (response.status === 200) {
      const mapModel = response.data;
      this.normalizeGroups(mapModel);
      this.setState({ mapModel, mapModelLoading: false });

      this.setState({ dataTableModel: { mapID, groupID: "Default" } });
      await this.initLayersInfo(mapModel);
      this.initSaveMapModelHandler();
    }
  }

  render() {
    const layers = this.state.mapModel ? this.state.mapModel.content.groups[0].layers : [];
    const title = this.state.mapModel ? this.state.mapModel.name : "Unknown";
    const description = (
      <div style={{ width: 480 }}>
        {this.state.mapModel ? this.state.mapModel.description : ""}
      </div>
    );
    const mapContainerLeftPadding = 280;

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
            <div
              id="mapContainer"
              style={{
                width: "100%",
                height: "100%",
                paddingLeft: mapContainerLeftPadding,
                overflowY: "hidden"
              }}
            >
              <MapView
                assignTileLayer={el => GKGlobalData.assign({ tileLayer: el })}
                assignHighlightLayer={el => GKGlobalData.assign({ highlightLayer: el })}
                highlights={this.state.highlights}
                onClick={e => this.onMapViewClick(e)}
              />
              <div
                id="tableContainer"
                style={{
                  height: 0,
                  bottom: 0,
                  left: mapContainerLeftPadding,
                  right: 0,
                  position: "absolute"
                }}
              >
                <Drawer
                  placement="bottom"
                  getContainer={"#tableContainer"}
                  height={360}
                  visible={this.state.dataTableDrawerVisible}
                  mask={false}
                  destroyOnClose={true}
                  onClose={() =>
                    this.setState({ dataTableDrawerVisible: false })
                  }
                >
                  <DataTable
                    layerID={this.state.dataTableModel.layerID}
                    groupID={this.state.dataTableModel.groupID}
                    mapID={this.state.dataTableModel.mapID}
                  />
                </Drawer>
              </div>
            </div>
            <Drawer
              placement="left"
              title={
                <SideBarHeader
                  loading={this.state.mapModelLoading}
                  onAddLayerClick={() => this.onAddLayerClick()}
                />
              }
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
                showDataTablePanel={layerID => this.showDataTablePanel(layerID)}
              />

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
                onClose={() => this.showSecondaryDrawer(false)}
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
      this.setState({ savingMapModel: true, savingMapModelError: "" });
      const response = await MapsService.updateMap(this.state.mapModel);
      if (response.status === 200) {
        errorModal.destroy();
      }
    } catch (ex) {
      this.setState({ savingMapModelError: ex.toString() });
    } finally {
      this.setState({ savingMapModel: false });
    }
  }

  onAddLayerClick() {
    this.showSecondaryDrawer(
      true,
      <DataSources
        onConfirm={newLayers => this.onAddLayerConfirm(newLayers)}
        onCancel={() => this.showSecondaryDrawer(false)}
      />,
      "New Layer",
      "Data Sources"
    );
  }

  onAddLayerConfirm(newLayersDef) {
    if (!newLayersDef || newLayersDef.length === 0) {
      return;
    }

    const mapModel = this.state.mapModel;
    const newLayers = newLayersDef.map(def => {
      const source = LayerTemplates.getFeatureSource(
        def.sourceType,
        def.name,
        def.path,
        def.srs,
        mapModel.content.srs.projection
      );
      const layer = LayerTemplates.getFeatureLayer(def.name, source);
      const style = StyleUtils.getStyleByGeomType(def.geomType, true);
      style !== null && layer.styles.push(style);

      return layer;
    });

    const group = mapModel.content.groups[0];
    if (group.layers === undefined) {
      group.layers = [];
    }

    group.layers.push(...newLayers);

    this.setState({ mapModel });
    this.showSecondaryDrawer(false);
    GKGlobalData.current.saveCurrentMapModel(async () => {
      const layerInfos = await MapsService.getLayersInfo(newLayers.map(l => l.id), 'Default', mapModel.id);
      GKGlobalData.updateLayerInfos(layerInfos);
    });
  }

  async onMapViewClick(e) {
    const response = await MapsService.getIntersection([e.latlng.lng, e.latlng.lat], 'WGS84', e.target.getZoom(), this.state.mapModel.id, 'WGS84');
    if (response.status === 200) {
      const features = _.flatMap(response.data, l => l.features);
      if (features.length > 0) {
        const featureCollection = LayerTemplates.getFeatureCollection(features);
        GKGlobalData.current.highlightLayer.leafletElement.clearLayers();
        GKGlobalData.current.highlightLayer.leafletElement.addData(featureCollection);
        const highlights = GKGlobalData.current.highlightLayer.leafletElement.getLayers();
        if (highlights.length > 0) {
          highlights[0].openPopup();
        }
      }
    }
  }

  showSecondaryDrawer(
    visible = false,
    secondaryDrawerChild = null,
    secondaryDrawerSubTitle = "",
    secondaryDrawerTitle = "Edit Style"
  ) {
    if (!visible) {
      this.setState({ secondaryDrawerVisible: visible, secondaryDrawerChild });
    } else {
      this.setState({
        secondaryDrawerVisible: visible,
        secondaryDrawerChild,
        secondaryDrawerSubTitle,
        secondaryDrawerTitle
      });
    }
  }

  showDataTablePanel(layerID) {
    const newDataTableModel = Object.assign(this.state.dataTableModel, { layerID });
    this.setState({
      dataTableModel: newDataTableModel,
      dataTableDrawerVisible: true
    });
  }

  normalizeGroups(mapModel) {
    const map = _.result(mapModel, "content");
    if (map === undefined) {
      return;
    }

    if (!map.groups) {
      map.groups = [LayerTemplates.getGroup()];
    }
  }

  initSaveMapModelHandler() {
    const that = this;
    GKGlobalData.assign({
      savingTimeoutID: null,
      saveCurrentMapModel: (saveCompleted = null) => {
        if (this.savingTimerID) {
          clearTimeout(this.savingTimerID);
        }
        this.savingTimerID = setTimeout(async () => {
          this.savingTimerID = null;
          try {
            await MapsService.updateMap(that.state.mapModel);
            if (saveCompleted) {
              await saveCompleted();
            }

            if (GKGlobalData.current.tileLayer) {
              const newURL = Config.serviceUrl("maps/1/image/xyz/{z}/{x}/{y}?q=" + +new Date());
              GKGlobalData.current.tileLayer.leafletElement.setUrl(newURL);
            }
          }
          catch (ex) {
            that.setState({
              savingMapModelError: ex.toString()
            });
            const errorModal = Modal.error({
              title: "Save Map Failed",
              content: (
                <div>
                  <div>
                    Latest map status is not synchronized with server with
                    following err. Click &nbsp;
                    <a onClick={e => that.onReSaveButtonClick(e, errorModal)}>
                      here
                    </a>{" "}
                    to save again or refresh current page to sync with latest
                    state.
                  </div>
                  <p style={{ marginTop: 8 }}>
                    {that.state.savingMapModelError}
                  </p>
                </div>
              )
            });
          }
        }, 1000);
      }
    });
  }

  async initLayersInfo(mapModel) {
    const layerIDs = _.flatMap(mapModel.content.groups, g => g.layers).map(l => l.id);
    const layerInfos = await MapsService.getLayersInfo(layerIDs, 'Default', mapModel.id);
    GKGlobalData.assign({ layerInfos });
  }
}