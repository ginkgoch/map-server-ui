import React, { Fragment } from "react";
import { Menu, Icon, Button, Dropdown } from "antd";
import { MapInfoModal } from "./MapInfoModal";
import { MapsService } from "../../services/maps/MapsService";

const { SubMenu } = Menu;

export class LaunchButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            createMapModalVisible: false
        };
    }

    render() {
        const menu = (
            <Menu
                onClick={this.onMenuItemClick.bind(this)}
            >
                <Menu.Item key="home-new">
                    <LaunchMenuItem iconType="plus" label="New"></LaunchMenuItem>
                </Menu.Item>
                <Menu.Item key="home-open">
                    <LaunchMenuItem iconType="folder-open" label="Open"></LaunchMenuItem>
                </Menu.Item>
                <Menu.Item key="home-open-recent">
                    <LaunchMenuItem
                        iconType="clock-circle"
                        label="Recently Visited"
                    ></LaunchMenuItem>
                </Menu.Item>
                <Menu.Item key="home-save">
                    <LaunchMenuItem iconType="save" label="Save"></LaunchMenuItem>
                </Menu.Item>
            </Menu>
        );

        return (
            <Fragment>
                <Dropdown overlay={menu}>
                    <Button
                        style={{ display: "inline-block", borderWidth: 0, marginLeft: -40 }}
                        shape="round"
                    >
                        <Icon type="menu"></Icon>
                    </Button>
                </Dropdown>
                <MapInfoModal visible={this.state.createMapModalVisible}
                    onCancel={this._createMapModalVisible.bind(this, false)}
                    onMapCreated={newMapInfo => this._onMapCreated(newMapInfo)}></MapInfoModal>
            </Fragment>
        );
    }

    onMenuItemClick(e) {
        switch (e.key) {
            case 'home-new':
                this._createMapModalVisible(true);
                break;
        }
    }

    _createMapModalVisible(visible) {
        this.setState({ createMapModalVisible: visible });
    }

    async _onMapCreated(newMapInfo) {
        const response = await MapsService.create(newMapInfo.name, newMapInfo.crs, newMapInfo.description);
        if (response.status === 200) {
            this._createMapModalVisible(false);
        }
    }
}

const LaunchMenuItem = props => {
    return (
        <span className="launch-button">
            <Icon type={props.iconType} />
            <span>{props.label}</span>
        </span>
    );
};