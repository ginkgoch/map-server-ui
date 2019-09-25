import _ from "lodash";
import React from "react";
import { Menu } from "antd";
import { Layer } from ".";
import { ModalUtils } from "../shared";
import { GKGlobal, GKGlobalUtils } from "../../shared";

export class Layers extends React.Component {
  constructor(props) {
    super(props);

    this.state = { layers: props.layers };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (nextProps.layers !== preState.layers) {
      return { ...preState, layers: nextProps.layers };
    }

    return null;
  }

  render() {
    return (
      <Menu
        mode="inline"
        selectable={true}
        mode="inline"
        inlineIndent="12"
        style={{ borderRightWidth: 0 }}
      >
        {this.state.layers.map(layer => (
          <Layer
            key={layer.id}
            layer={layer}
            removingLayer={this.removeLayer(layer.id, this.state.layers)}
            showStyleEditPanel={this.props.showStyleEditPanel}
            showDataTablePanel={this.props.showDataTablePanel}
          />
        ))}
      </Menu>
    );
  }

  removeLayer(layerId, layers) {
    return () => {
      ModalUtils.promptRemoveModal("layer", () => {
        _.remove(layers, layer => layer.id === layerId);
        this.setState({ layers });
        GKGlobal.state.saveCurrentMapModel(() => GKGlobalUtils.removeLayerInfo(layerId));
      });
    };
  }
}
