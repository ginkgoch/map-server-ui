import _ from "lodash";
import React from "react";
import { Menu } from "antd";
import { Layer } from ".";
import { ModalUtils } from "../shared";

export class Layers extends React.Component {
  constructor(props) {
    super(props);

    this.state = { layers: props.layers };
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
            onCloseButtonClick={this.removeLayer(layer.id, this.state.layers)}
            onEditButtonClick={this.props.onEditButtonClick}
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
      });
    };
  }
}
