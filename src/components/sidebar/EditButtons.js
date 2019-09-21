import React from "react";
import { Button, Icon, Menu, Dropdown } from "antd";
import { StyleUtils } from "../styles";

export class EditButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = { visible: props.visible };
  }

  render() {
    const iconStyle = {
      marginRight: 0
    };

    const btnStyle = {
      marginLeft: 4
    };

    let btns = [];
    btns.push({
      type: this.state.visible ? 'eye': 'eye-invisible',
      click: e => {
        e.stopPropagation();
        const newVisible = !this.state.visible;
        this.setState({ visible: newVisible });
        this.props.onVisibleChange && this.props.onVisibleChange(newVisible);
      }
    });

    if(this.props.showDataTableButton) {
      btns.push({
        type: 'table',
        click: e => {
          e.stopPropagation();
          this.props.onShowDataTable();
        }
      })
    }

    if (!this.props.hideEditButton) {
      btns.push({
        type: "edit",
        click: e => {
          e.stopPropagation();
          this.props.onEditButtonClick && this.props.onEditButtonClick(e);
        }
      });
    }

    if (!this.props.hideStyleButton) {
      btns.push({
        type: 'bg-colors',
        click: e => {
          e.stopPropagation();
          this.props.onStyleButtonClick && this.props.onStyleButtonClick(e);
        }
      });
    }

    btns.push({
      type: "close",
      click: e => {
        e.stopPropagation();
        this.props.onCloseButtonClick && this.props.onCloseButtonClick(e);
      }
    });

    btns = btns.map(btn => (
      this.getButton(btn, btnStyle, iconStyle)
    ));

    return (
      <React.Fragment>
        <div className="edit-buttons">{btns}</div>
      </React.Fragment>
    );
  }

  getButton(btn, btnStyle, iconStyle) {
    if (btn.type === 'bg-colors') {
      return (
        <Dropdown key={btn.type} overlay={this.getNewStyleMenu()} trigger={['click']}>
          {this._getButton(btn, btnStyle, iconStyle)}
        </Dropdown>
      );
    } else {
      return this._getButton(btn, btnStyle, iconStyle);
    }
  }

  _getButton(btn, btnStyle, iconStyle) {
    return <Button
      key={btn.type}
      shape="circle"
      size="small"
      style={btnStyle}
      onClick={btn.click}
    >
      <Icon type={btn.type} size="small" style={iconStyle} />
    </Button>
  }

  getNewStyleMenu() {
    const allStyleTypes = StyleUtils.allStyleTypes();
    return <Menu>
      {
        allStyleTypes.map(type => (
          <Menu.Item key={type} onClick={e => this.newStyle(type, e)()}>
            {StyleUtils.styleTypeName(type)}
          </Menu.Item>
        ))
      }
    </Menu>
  }

  newStyle(styleType, e) {
    return () => {
      this.props.onNewStyleMenuItemClick && this.props.onNewStyleMenuItemClick(styleType);
      e.domEvent.stopPropagation();
    }
  }
}