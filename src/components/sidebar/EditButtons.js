import _ from "lodash";
import React from "react";
import { Icon, Menu, Dropdown } from "antd";
import { StyleUtils } from "../styles";

export class EditButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = { visible: props.visible };
  }

  render() {
    const menuItemSource = this.getMenuItemSource();

    return (
      <div onClick={e => e.stopPropagation()}>
        <Dropdown overlay={this.renderMenu(menuItemSource)} trigger={['click']}>
          <Icon type="more" />
        </Dropdown>
      </div>
    );
  }

  renderMenu(btns) {
    return (
      <Menu>
        {
          btns.map(btn => this.renderMenuItem(btn))
        }
      </Menu>
    );
  }

  renderMenuItem(btn) {
    if (btn.type === MenuItemActions.divider) {
      return <Menu.Divider key={btn.key} />
    }
    else if (btn.key === 'style') {
      return (
        <Menu.SubMenu key={btn.key} title={<React.Fragment><Icon type={btn.type} size="small" /> {btn.tips}</React.Fragment>}>
          {
            this.renderNewStyleMenuItem()
          }
        </Menu.SubMenu>
      );
    }
    else {
      return (
        <Menu.Item key={btn.key} onClick={btn.click}>
          <Icon type={btn.type} size="small" />
          <span className="sidebar-menu-item-label">{btn.tips}</span>
        </Menu.Item>
      );
    }
  }

  renderNewStyleMenuItem() {
    const allStyleTypes = StyleUtils.allStyleTypes();
    return allStyleTypes.map(type => (
      <Menu.Item key={type} onClick={e => this.newStyle(type, e)()}
        disabled={!StyleUtils.isStyleAvailableForGeomType(type, this.props.geomType || 'unknown')}>
        {StyleUtils.styleTypeName(type)}
      </Menu.Item>
    ));
  }

  newStyle(styleType, e) {
    return () => {
      e.domEvent.stopPropagation();
      this.props.onNewStyleMenuItemClick && this.props.onNewStyleMenuItemClick(styleType);
    }
  }

  getMenuItemSource() {
    let menuItemSource = [];
    menuItemSource.push({
      key: MenuItemActions.visible,
      type: this.state.visible ? 'eye' : 'eye-invisible',
      tips: 'Visibility',
      click: e => {
        e.domEvent.stopPropagation();

        const newVisible = !this.state.visible;
        this.setState({ visible: newVisible });
        this.props.onVisibleChange && this.props.onVisibleChange(newVisible);
      }
    });

    if (this.props.editFor === 'layer') {
      menuItemSource.push({
        key: MenuItemActions.zoomToLayer,
        type: 'fullscreen-exit',
        tips: 'Zoom to layer',
        click: e => {
          e.domEvent.stopPropagation();

          this.props.onZoomToLayer && this.props.onZoomToLayer();
        }
      });
    }

    if (this.props.editFor === 'layer') {
      menuItemSource.push({
        key: MenuItemActions.datatable,
        type: 'table',
        tips: 'Show data',
        click: e => {
          e.domEvent.stopPropagation();
          this.props.onShowDataTable && this.props.onShowDataTable();
        }
      })
    }

    if (this.props.editFor === 'style') {
      menuItemSource.push({
        key: MenuItemActions.edit,
        type: "edit",
        tips: 'Edit',
        click: e => {
          e.domEvent.stopPropagation();
          this.props.onEditButtonClick && this.props.onEditButtonClick(e.domEvent);
        }
      });
    }

    if (this.props.editFor === 'layer') {
      menuItemSource.push({
        key: MenuItemActions.style,
        type: 'bg-colors',
        tips: 'Set style',
        click: e => {
          e.domEvent.stopPropagation();
          this.props.onStyleButtonClick && this.props.onStyleButtonClick(e.domEvent);
        }
      });
    }

    menuItemSource.push({
      key: MenuItemActions.remove,
      type: "close",
      tips: 'Remove',
      click: e => {
        e.domEvent.stopPropagation();
        this.props.onCloseButtonClick && this.props.onCloseButtonClick(e.domEvent);
      }
    });

    menuItemSource.push({ key: 'move-divider', type: MenuItemActions.divider })

    menuItemSource.push({
      key: MenuItemActions.moveUp,
      type: 'up',
      tips: 'Move up',
      click: e => {
        e.domEvent.stopPropagation();
        this.props.onMove && this.props.onMove('up');
      }
    });

    menuItemSource.push({
      key: MenuItemActions.moveDown,
      type: 'down',
      tips: 'Move down',
      click: e => {
        e.domEvent.stopPropagation();
        this.props.onMove && this.props.onMove('down');
      }
    });

    menuItemSource.push({
      key: MenuItemActions.moveToTop,
      type: 'vertical-align-top',
      tips: 'Move to top',
      click: e => {
        e.domEvent.stopPropagation();
        this.props.onMove && this.props.onMove('top');
      }
    });

    menuItemSource.push({
      key: MenuItemActions.moveToBottom,
      type: 'vertical-align-bottom',
      tips: 'Move to bottom',
      click: e => {
        e.domEvent.stopPropagation();
        this.props.onMove && this.props.onMove('bottom');
      }
    });

    return menuItemSource;
  }
}

const MenuItemActions = {
  'visible': 'visible',
  'datatable': 'show-data-table',
  'edit': 'edit',
  'style': 'style',
  'remove': 'remove',
  'zoomToLayer': 'zoomToLayer',
  'divider': 'divider',
  'moveUp': 'moveUp',
  'moveDown': 'moveDown',
  'moveToTop': 'moveToTop',
  'moveToBottom': 'moveToBottom'
}