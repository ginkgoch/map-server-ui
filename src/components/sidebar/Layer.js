import _ from "lodash";
import L from 'leaflet';
import React, { Component } from "react";
import { Menu } from "antd";
import { LayerPreview, ModalUtils } from "../shared";
import { EditButtons, Style } from ".";
import { FillStyle, LineStyle, NoneStyle, PointStyle, ClassBreakStyle, StyleUtils, ValueStyle, TextStyle } from "../styles";
import { GKGlobal, GKGlobalUtils } from "../../shared";

const { SubMenu } = Menu;

export class Layer extends Component {
  constructor(props) {
    super(props);
    this.state = { layer: props.layer };
  }

  render() {
    const layer = this.state.layer;
    const passThroughProps = _.omit(this.props, ['removingLayer', 'moveLayer', 'showStyleEditPanel', 'showDataTablePanel']);
    return (
      <SubMenu key={layer.id} title={this.layerTitle(layer)} {...passThroughProps}>
        {layer.styles.map(s => (
          <Style
            key={s.id}
            style={s}
            layer={layer}
            onMoveStyle={this.moveStyle(layer)}
            onCloseButtonClick={this.removeStyle(s.id, layer)}
            onEditButtonClick={this.editStyle(s.id, layer)}
          />
        ))}
      </SubMenu>
    );
  }

  layerTitle(l) {
    const geomType = this.getGeomTypeByLayer(l);
    return (
      <div className="sidebar-item">
        <span>
          <LayerPreview layer={l} /> {l.name}
        </span>
        <div>
          <EditButtons visible={l.visible === undefined ? true : l.visible}
            geomType={geomType}
            editFor="layer"
            onShowDataTable={() => this.props.showDataTablePanel(l.id)}
            onCloseButtonClick={this.props.removingLayer}
            onNewStyleMenuItemClick={this.newStyle(l)}
            onZoomToLayer={this.zoomToLayer(l)}
            onMove={moveDirection => this.props.moveLayer(l, moveDirection)}
            onVisibleChange={visible => {
              l.visible = visible;
              GKGlobal.state.saveCurrentMapModel();
            }} />
        </div>
      </div>
    );
  }

  moveStyle(layer) {
    return (style, direction) => {
      let index = layer.styles.indexOf(style);
      if (index >= 0) {
        const movingLayers = layer.styles.splice(index, 1);
        switch (direction) {
          case 'up':
            index--;
            if (index < 0) { 
              index = 0;
            }
            layer.styles.splice(index, 0, ...movingLayers);
            break;
          case 'down':
            index++;
            if (index > layer.styles.length) { 
              index = layer.styles.length;
            }
            layer.styles.splice(index, 0, ...movingLayers);
            break;
          case 'top':
            layer.styles.splice(0, 0, ...movingLayers);
            break;
          case 'bottom':
            layer.styles.splice(layer.styles.length, 0, ...movingLayers);
            break;
        }
      }

      this.setState({ layer });
      GKGlobal.state.saveCurrentMapModel();
    };
  }

  removeStyle(id, layer) {
    return () => {
      ModalUtils.promptRemoveModal("style", () => {
        _.remove(layer.styles, s => s.id === id);
        this.setState({ layer });
        GKGlobal.state.saveCurrentMapModel();
      });
    };
  }

  editStyle(id, layer) {
    return () => {
      const onEditStyleSubmit = (newStyle => {
        const index = layer.styles.findIndex(s => s.id === newStyle.id);
        layer.styles[index] = newStyle;

        this.setState(this.state);
        GKGlobal.state.saveCurrentMapModel();
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
      GKGlobal.state.saveCurrentMapModel();
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
    const geomType = this.getGeomTypeByLayer(layer);
    const layerIdentifyProps = {
      layerID: layer.id,
      groupID: 'Default',
      mapID: GKGlobal.state.mapModel.id
    };

    switch (style.type) {
      case 'fill-style':
        return <FillStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onSubmitHandler} />
      case 'line-style':
        return <LineStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onSubmitHandler} />
      case 'point-style':
        return <PointStyle style={style} onEditStyleCanceled={onEditStyleCanceled} onEditStyleSubmit={onSubmitHandler} />
      case 'text-style':
        return <TextStyle style={style} 
          onEditStyleCanceled={onEditStyleCanceled} 
          onEditStyleSubmit={onSubmitHandler} 
          {...layerIdentifyProps} />
      case 'class-break-style':
        return <ClassBreakStyle style={style}
          geomType={geomType}
          onEditStyleCanceled={onEditStyleCanceled}
          onEditStyleSubmit={onSubmitHandler}
          {...layerIdentifyProps} />
      case 'value-style':
        return <ValueStyle style={style}
          geomType={geomType}
          onEditStyleCanceled={onEditStyleCanceled}
          onEditStyleSubmit={onSubmitHandler}
          {...layerIdentifyProps} />
      default:
        return <NoneStyle />
    }
  }

  getStyleTypeName(style) {
    return StyleUtils.styleTypeName(style);
  }

  getGeomTypeByLayer(layer) {
    const layerInfo = GKGlobalUtils.getLayerInfo(layer.id);
    const geomType = layerInfo ? layerInfo.geomType : 'unknown';
    return geomType;
  }

  zoomToLayer(l) {
    return () => {
      const layerInfo = GKGlobalUtils.getLayerInfo(l.id);
      const pointLL = L.point(layerInfo.envelope.minx, layerInfo.envelope.miny);
      const pointUR = L.point(layerInfo.envelope.maxx, layerInfo.envelope.maxy);
      const latlngLL = L.Projection.SphericalMercator.unproject(pointLL);
      const latlngUR = L.Projection.SphericalMercator.unproject(pointUR);
      const latlngBounds = L.latLngBounds(latlngLL, latlngUR);
      GKGlobal.state.map.leafletElement.fitBounds(latlngBounds);
    };
  }
}