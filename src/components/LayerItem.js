import React from "react";
import { Menu, Icon } from "antd";
import StyleItem from './StyleItem';

const {SubMenu} = Menu;
export default (layer, key) => {
    return (
        <SubMenu key={key} title={<i><Icon type="star"></Icon> {layer.name}</i>}>
            {
                layer.styles.map(s => (
                    <Menu.Item key={s.id}>
                        <StyleItem key={s.id} style={s}></StyleItem>
                    </Menu.Item>
                ))
            }
        </SubMenu>
    );
}

