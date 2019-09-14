import React, { Fragment } from "react";
import { Menu, Icon, Button, Dropdown } from "antd";
import { MapInfoModal } from "../modals";
import { MapsService } from "../../services/MapsService";

export class LaunchButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mapModalVisible: false
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
                <MapInfoModal visible={this.state.mapModalVisible}
                    onCancel={this.setMapModalVisible.bind(this, false)}
                    onConfirm={newMapInfo => this.onMapModalConfirm(newMapInfo)}></MapInfoModal>
            </Fragment>
        );
    }

    onMenuItemClick(e) {
        switch (e.key) {
            case 'home-new':
                this.setMapModalVisible(true);
                break;
        }
    }

    setMapModalVisible(visible) {
        this.setState({ mapModalVisible: visible });
    }

    async onMapModalConfirm(newMapInfo) {
        const response = await MapsService.create(newMapInfo.name, newMapInfo.crs, newMapInfo.description);
        if (response.status === 200) {
            this.setMapModalVisible(false);
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