import _ from "lodash";
import React, { Component } from "react";
import { Menu } from "antd";
import { Style } from ".";
import { LayerPreview } from "../shared/LayerPreview";
import { EditButtons } from ".";
import { ModalUtils } from "../shared";

const { SubMenu } = Menu;

export class Layer extends Component {
  constructor(props) {
    super(props);
    this.state = { layer: props.layer };
  }

  render() {
    const layer = this.state.layer;
    return (
      <SubMenu key={layer.id} title={this.layerTitle(layer)} {...this.props}>
        {layer.styles.map(s => (
          <Style
            key={s.id}
            style={s}
            layer={layer}
            onCloseButtonClick={this.removeStyle(s.id, layer)}
          />
        ))}
      </SubMenu>
    );
  }

  removeStyle(id, layer) {
    return () => {
      ModalUtils.promptRemoveModal("style", () => {
        _.remove(layer.styles, s => s.id === id);
        this.setState({ layer });
      });
    };
  }

  layerTitle(l) {
    return (
      <div className="sidebar-item">
        <span>
          <LayerPreview layer={l} /> {l.name}
        </span>
        <div>
          <EditButtons onCloseButtonClick={this.props.onCloseButtonClick} />
        </div>
      </div>
    );
  }
}
