import _ from "lodash";
import React, { Component } from "react";
import { Menu } from "antd";
import { LayerPreview, ModalUtils } from "../shared";
import { EditButtons, Style } from ".";
import { FillStyle, LineStyle, NoneStyle, PointStyle, ClassBreakStyle, StyleUtils, ValueStyle } from "../styles";

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
          <EditButtons visible={l.visible === undefined ? true : l.visible}
            showDataTableButton={true}
            hideEditButton={true}
            hideStyleButton={false}
            onShowDataTable={() => this.props.showDataTablePanel(l.id)}
            onCloseButtonClick={this.props.removingLayer}
            onNewStyleMenuItemClick={this.newStyle(l)}
            onVisibleChange={visible => {
              l.visible = visible;
              GKGlobal.saveCurrentMapModel();
            }} />
        </div>
      </div>
    );
  }

  removeStyle(id, layer) {
    return () => {
      ModalUtils.promptRemoveModal("style", () => {
        _.remove(layer.styles, s => s.id === id);
        this.setState({ layer });
        GKGlobal.saveCurrentMapModel();
      });
    };
  }

  editStyle(id, layer) {
    return () => {
      const onEditStyleSubmit = (newStyle => {
        const index = layer.styles.findIndex(s => s.id === newStyle.id);
        layer.styles[index] = newStyle;

        this.setState(this.state);
        GKGlobal.saveCurrentMapModel();
        this.props.showStyleEditPanel && this.props.showStyleEditPanel(false, null);
      }).bind(this);

      let style = layer.styles.find(s => s.id === id);
      style = _.cloneDeep(style);

      const styleEditComponent = this.getStyleComponent(style, layer, onEditStyleSubmit);
      const styleType = this.getStyleTypeName(style);
      this.props.showStyleEditPanel && this.props.showStyleEditPanel(true, styleEditComponent, styleType);
    };
  }

  newStyle(layer) {
    const onNewStyleSubmit = (newStyle => {
      layer.styles.push(newStyle);
      this.setState(this.state);
      GKGlobal.saveCurrentMapModel();
      this.props.showStyleEditPanel && this.props.showStyleEditPanel(false, null);
    }).bind(this);

    return styleType => {
      const style = StyleUtils.defaultStyle(styleType);
      const styleEditComponent = this.getStyleComponent(style, layer, onNewStyleSubmit);
      const styleTypeName = this.getStyleTypeName(style);
      this.props.showStyleEditPanel && this.props.showStyleEditPanel(true, styleEditComponent, styleTypeName, 'New Style');
    };
  }

  getStyleComponent(style, layer, onSubmitHandler) {
    const onEditStyleCanceled = () => this.props.showStyleEditPanel(false);

    switch (style.type) {
      case 'fill-style':
        return <FillStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onSubmitHandler} />
      case 'line-style':
        return <LineStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onSubmitHandler} />
      case 'point-style':
        return <PointStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onSubmitHandler} />
      case 'class-break-style':
        return <ClassBreakStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onSubmitHandler} />
      case 'value-style':
        return <ValueStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onSubmitHandler} />
      default:
        return <NoneStyle />
    }
  }

  getStyleTypeName(style) {
    return StyleUtils.styleTypeName(style);
  }
}
