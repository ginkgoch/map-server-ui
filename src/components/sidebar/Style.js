import _ from "lodash";
import React from "react";
import { StylePreview, ModalUtils } from "../shared";
import { EditButtons } from ".";
import { Menu } from "antd";

const { SubMenu } = Menu;
export class Style extends React.Component {
  constructor(props) {
    super(props);

    this.state = { style: props.style };
  }

  render() {
    return this._renderStyle();
  }

  _renderStyle() {
    const style = this.props.style;

    switch (style.type) {
      case "class-break-style":
        return this._classBreakStyle(style);
      case "value-style":
        return this._valueStyle(style);
      default:
        return this._simpleStyle(style);
    }
  }

  _styleContent(style, onCloseButtonClick = this.props.onCloseButtonClick) {
    return (
      <div className="sidebar-item">
        <div>
          <StylePreview style={style} />
          <span className="style-label">{style.name}</span>
        </div>
        <div>
          <EditButtons visible={style.visible === undefined ? true : style.visible}
            hideStyleButton={true}
            onCloseButtonClick={onCloseButtonClick}
            onEditButtonClick={this.props.onEditButtonClick}
            onVisibleChange={visible => {
              style.visible = visible;
              GKGlobal.saveCurrentMapModel();
            }} />
        </div>
      </div>
    );
  }

  _simpleStyle(style) {
    return (
      <Menu.Item {...this._passThroughProps()}>
        {this._styleContent(style)}
      </Menu.Item>
    );
  }

  _classBreakStyle(style) {
    return (
      <SubMenu title={this._styleContent(style)} {...this._passThroughProps()}>
        {style.classBreaks.map(cb => {
          return (
            <Menu.Item
              key={cb.style.id}
              style={{ height: "30px", lineHeight: "30px" }}
            >
              {this._styleContent(
                cb.style,
                this._removeClassBreak(cb.style.id, style)
              )}
            </Menu.Item>
          );
        })}
      </SubMenu>
    );
  }

  _valueStyle(style) {
    return (
      <React.Fragment>
        <SubMenu
          title={this._styleContent(style)}
          {...this._passThroughProps()}
        >
          {style.items.map(cb => {
            return (
              <Menu.Item
                key={cb.style.id}
                style={{ height: "30px", lineHeight: "30px" }}
              >
                {this._styleContent(
                  cb.style,
                  this._removeValueItem(cb.style.id, style)
                )}
              </Menu.Item>
            );
          })}
        </SubMenu>
      </React.Fragment>
    );
  }

  _removeClassBreak(id, classBreakStyle) {
    return () => {
      this._confirm("class break", () => {
        _.remove(classBreakStyle.classBreaks, cb => cb.style.id === id);
        this.setState({ style: this.state.style });
      });
    };
  }

  _removeValueItem(id, valueStyle) {
    return () => {
      this._confirm("value item", () => {
        _.remove(valueStyle.items, cb => cb.style.id === id);
        this.setState({ style: this.state.style });
      });
    };
  }

  _passThroughProps() {
    return _.omit(this.props, ["layer", "style", "onCloseButtonClick", "onEditButtonClick"]);
  }

  _confirm(typeName, okHandler) {
    ModalUtils.promptRemoveModal(typeName, okHandler);
  }
}
