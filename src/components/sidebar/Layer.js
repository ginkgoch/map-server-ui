import _ from "lodash";
import React, { Component } from "react";
import { Menu } from "antd";
import { LayerPreview, ModalUtils } from "../shared";
import { EditButtons, Style } from ".";
import { FillStyle, LineStyle, NoneStyle, PointStyle, ClassBreakStyle, StyleUtils } from "../styles";

const { SubMenu } = Menu;

export class Layer extends Component {
  constructor(props) {
    super(props);
    this.state = { layer: props.layer };
  }

  render() {
    const layer = this.state.layer;
    const passThroughProps = _.omit(this.props, ['removingLayer', 'showStyleEditPanel']);
    return (
      <SubMenu key={layer.id} title={this.layerTitle(layer)} {...passThroughProps}>
        {layer.styles.map(s => (
          <Style
            key={s.id}
            style={s}
            layer={layer}
            onCloseButtonClick={this.removeStyle(s.id, layer)}
            onEditButtonClick={this.editStyle(s.id, layer)}
          />
        ))}
      </SubMenu>
    );
  }

  layerTitle(l) {
    return (
      <div className="sidebar-item">
        <span>
          <LayerPreview layer={l} /> {l.name}
        </span>
        <div>
          <EditButtons hideEditButton={true} onCloseButtonClick={this.props.removingLayer} />
        </div>
      </div>
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

  editStyle(id, layer) {
    return () => {
      const style = layer.styles.find(s => s.id === id);
      const styleEditComponent = this.getStyleComponent(style, layer);
      const styleType = this.getStyleTypeName(style);
      this.props.showStyleEditPanel && this.props.showStyleEditPanel(true, styleEditComponent, styleType);
    };
  }

  getStyleComponent(style, layer) {
    style = _.cloneDeep(style);

    const onEditStyleCanceled = this.props.showStyleEditPanel.bind(this, false);
    const onEditStyleSubmit = (newStyle => {
      const index = layer.styles.findIndex(s => s.id === newStyle.id);
      layer.styles[index] = newStyle;

      this.setState(this.state);
      this.props.showStyleEditPanel && this.props.showStyleEditPanel(false, null);
    }).bind(this);

    switch (style.type) {
      case 'fill-style':
        return <FillStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onEditStyleSubmit} />
      case 'line-style':
        return <LineStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onEditStyleSubmit} />
      case 'point-style':
        return <PointStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onEditStyleSubmit} />
      case 'class-break-style':
        return <ClassBreakStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onEditStyleSubmit} />
      default:
        return <NoneStyle />
    }
  }

  getStyleTypeName(style) {
    return StyleUtils.styleTypeName(style);
  }
}
