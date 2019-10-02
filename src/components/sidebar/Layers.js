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
            moveLayer={(layer, moveDirection) => this.moveLayer(layer, moveDirection)}
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

  moveLayer(layer, moveDirection) {
    let index = this.state.layers.indexOf(layer);
    if (index >= 0) {
      const movingLayers = this.state.layers.splice(index, 1);
      switch (moveDirection) {
        case 'up':
          index--;
          if (index >= 0) {
            this.state.layers.splice(index, 0, ...movingLayers);
          }
          break;
        case 'down':
          index++;
          if (index <= this.state.layers.length) {
            this.state.layers.splice(index + 1, 0, ...movingLayers);
          }
          break;
        case 'top':
          this.state.layers.splice(0, 0, ...movingLayers);
          break;
        case 'bottom':
          this.state.layers.splice(this.state.layers.length, 0, ...movingLayers);
          break;
        default:
          break;
      }

      this.setState({ layers: this.state.layers });
      GKGlobal.state.saveCurrentMapModel();
    }
  }
}
