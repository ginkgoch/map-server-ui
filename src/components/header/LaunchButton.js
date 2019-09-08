import React from 'react';
import { Menu, Icon, Button, Dropdown } from 'antd';

const { SubMenu } = Menu;

export class LaunchButton extends React.Component {
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="home-new">
                    <LaunchMenuItem iconType="plus" label="New"></LaunchMenuItem>
                </Menu.Item>
                <Menu.Item key="home-open">
                    <LaunchMenuItem iconType="folder-open" label="Open"></LaunchMenuItem>
                </Menu.Item>
                <Menu.Item key="home-open-recent">
                    <LaunchMenuItem iconType="clock-circle" label="Recently Visited"></LaunchMenuItem>
                </Menu.Item>
                <Menu.Item key="home-save">
                    <LaunchMenuItem iconType="save" label="Save"></LaunchMenuItem>
                </Menu.Item>
            </Menu>
            );

        return (
            <Dropdown overlay={menu}>
                <Button style={{display: "inline-block", borderWidth: 0, marginLeft: -40}} shape="round">
                    <Icon type="menu"></Icon>
                </Button>
            </Dropdown>
        );
    }
}

const LaunchMenuItem = props => {
    return (
        <span className="launch-button">
            <Icon type={ props.iconType } />
            <span>{ props.label }</span>
        </span>
    );
}